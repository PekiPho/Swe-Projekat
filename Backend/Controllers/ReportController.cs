using Microsoft.AspNetCore.Authentication.Cookies;
using Backend.Models;
using System.Text.Json;
using Backend.Dtos;
using Newtonsoft.Json;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class ReportController : ControllerBase
{
    private readonly ApplContext Context;

    public ReportController(ApplContext context)
    {
        Context = context;
    }

    //Create

    [HttpPost("AddReport/{username}")]
    public async Task<ActionResult> AddReport(string username, [FromForm] string reportJson, [FromForm] IFormFile? files)
    {
        //only single file za sad
        //ce dodam kasnije ako me ne mrzi ali je dosta dodatan complexity

        var user = await Context.Users.FirstOrDefaultAsync(c => c.Username == username);

        if (user == null)
            return NotFound("User Not Found");

        var report = JsonConvert.DeserializeObject<Report>(reportJson);
        if (report == null)
            return BadRequest("Report Not Found");

        report.User = user;
        report.Media = report.Media ?? new List<Media>();

        await Context.Reports.AddAsync(report);
        await Context.SaveChangesAsync();

        if (files != null)
        {
            var extensions = new List<string> { ".jpg", ".png", "jpeg" };
            var ext = Path.GetExtension(files.FileName).ToLowerInvariant();

            if (!extensions.Contains(ext))
                return BadRequest("Image with this extension is NOT allowed");

            var mediaFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Media");

            if (!Directory.Exists(mediaFolder))
                Directory.CreateDirectory(mediaFolder);

            var media = new Media
            {
                Report = report,
                Url = ""
            };

            await Context.Media.AddAsync(media);
            await Context.SaveChangesAsync();  // Save to get media.Id

            var fileName = media.MediaId + ext;
            var filePath = Path.Combine(mediaFolder, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await files.CopyToAsync(stream);

            media.Url = Path.Combine("Media", fileName).Replace("\\", "/");
            Context.Media.Update(media);
            await Context.SaveChangesAsync();

            report.Media.Add(media);
        }

        return Ok(report);
    }


    //Read

    [HttpGet("GetReportsByUser/{username}/{page?}")]
    public async Task<ActionResult> GetReportsByUser(string username, int page = 1)
    {
        var reports = await Context.Reports.Include(c => c.User)
                                    .Include(c => c.Media)
                                    .Include(c => c.Comments)
                                    .Include(c => c.Followers)
                                    .Include(c => c.Region)
                                    .Include(c => c.Tags)
                                    .Include(c => c.ResolutionStatus)
                                    .Include(c => c.Severity)
                                    .Where(c => c.User.Username == username)
                                    .OrderByDescending(c => c.DateOfPost)
                                    .Skip((page - 1) * 50)
                                    .Take(50)
                                    .ToListAsync();


        //var postsDto;

        return Ok(reports);

    }

    [HttpGet("GetreportById/{reportId}")]
    public async Task<ActionResult> GetReportById(Guid reportId)
    {
        var report = await Context.Reports.Include(c => c.User)
                                    .Include(c => c.Media)
                                    .Include(c => c.Comments)
                                    .Include(c => c.Followers)
                                    .Include(c => c.Region)
                                    .Include(c => c.Tags)
                                    .Include(c => c.ResolutionStatus)
                                    .Include(c => c.Severity)
                                    .Where(c => c.Id == reportId)
                                    .FirstOrDefaultAsync();

        if (report == null)
            return NotFound("Post Not Found");

        return Ok(report);
    }

    [HttpGet("GetReportsThatUserIsFollowing/{username}/{page?}")]
    public async Task<ActionResult> GetReportsThatUserIsFollowing(string username, int page = 1)
    {
        var reports = await Context.Reports.Include(c => c.User)
                                    .Include(c => c.Media)
                                    .Include(c => c.Comments)
                                    .Include(c => c.Followers)
                                    .Include(c => c.Region)
                                    .Include(c => c.Tags)
                                    .Include(c => c.ResolutionStatus)
                                    .Include(c => c.Severity)
                                    .Where(c => c.Followers.Any(a => a.Username == username))
                                    .OrderByDescending(c => c.DateOfPost)
                                    .Skip((page - 1) * 50)
                                    .Take(50)
                                    .ToListAsync();

        return Ok(reports);
    }

    [HttpGet("GetReportsFiltered/{page?}")]
    public async Task<ActionResult> GetReportsFiltered(
        int page = 1,
        [FromQuery] string? tags = null,
        [FromQuery] string? severityLevel = null,
        [FromQuery] string? resolutionStatus = null,
        [FromQuery] string? region = null
        )
    {
        var query = Context.Reports.Include(c => c.User)
                                .Include(c => c.Media)
                                .Include(c => c.Comments)
                                .Include(c => c.Followers)
                                .Include(c => c.Region)
                                .Include(c => c.Tags)
                                .Include(c => c.ResolutionStatus)
                                .Include(c => c.Severity)
                                .AsQueryable();

        if (!string.IsNullOrWhiteSpace(severityLevel))
            query = query.Where(c => c.Severity != null && c.Severity.Level == severityLevel);

        if (!string.IsNullOrWhiteSpace(resolutionStatus))
            query = query.Where(c => c.ResolutionStatus != null && c.ResolutionStatus.Status == resolutionStatus);

        if (!string.IsNullOrWhiteSpace(region))
            query = query.Where(c => c.Region != null && c.Region.Name == region);

        if (!string.IsNullOrWhiteSpace(tags))
        {
            var tagList = tags.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            query = query.Where(c => c.Tags.Any(a => tagList.Contains(a.Name)));
        }

        var reports = await query.OrderByDescending(c => c.DateOfPost)
                                .Skip((page - 1) * 50)
                                .Take(50)
                                .ToListAsync();

        return Ok(reports);
    }



    //Update

    [HttpPut("UpdateReport/{reportId}")]
    public async Task<ActionResult> UpdateReport(Guid reportId, [FromBody] UpdateReportDto dto)
    {
        var report = await Context.Reports
            .Include(r => r.Tags)
            .Include(r => r.Region)
            .Include(r => r.Severity)
            .Include(r => r.ResolutionStatus)
            .FirstOrDefaultAsync(r => r.Id == reportId);

        if (report == null)
            return NotFound("Report Not Found");

        if (!string.IsNullOrWhiteSpace(dto.Title))
            report.Title = dto.Title;

        if (!string.IsNullOrWhiteSpace(dto.Description))
            report.Description = dto.Description;

        if (!string.IsNullOrWhiteSpace(dto.RegionName))
        {
            var region = await Context.Regions.FirstOrDefaultAsync(r => r.Name == dto.RegionName);
            if (region != null)
                report.Region = region;
        }

        if (!string.IsNullOrWhiteSpace(dto.SeverityLevel))
        {
            var severity = await Context.Severity.FirstOrDefaultAsync(s => s.Level == dto.SeverityLevel);
            if (severity != null)
                report.Severity = severity;
        }

        if (!string.IsNullOrWhiteSpace(dto.ResolutionStatus))
        {
            var resolution = await Context.ResolutionStatuses.FirstOrDefaultAsync(rs => rs.Status == dto.ResolutionStatus);
            if (resolution != null)
                report.ResolutionStatus = resolution;
        }

        if (dto.Tags != null && dto.Tags.Any())
        {
            var tagEntities = await Context.Tags
                .Where(t => dto.Tags.Contains(t.Name))
                .ToListAsync();

            report.Tags.Clear();
            report.Tags.AddRange(tagEntities);
        }

        await Context.SaveChangesAsync();

        return Ok("Report updated successfully");
    }

    //Delete

    [HttpDelete("DeleteReport/{reportId}")]
    public async Task<ActionResult> DeleteReport(Guid reportId)
    {
        var report = await Context.Reports.Include(c => c.Comments)
                                            .FirstOrDefaultAsync(c => c.Id == reportId);

        if (report == null)
            return NotFound("Report Not Found");

        if (report.Comments != null && report.Comments.Any())
        {
            Context.Comments.RemoveRange(report.Comments);
        }

        Context.Reports.Remove(report);

        await Context.SaveChangesAsync();

        return Ok("Report and Comments Deleted");
    }
}