using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.FileProviders;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class FiltersController : ControllerBase
{
    private readonly ApplContext Context;

    public FiltersController(ApplContext context)
    {
        Context = context;
    }

    //Tags

    [HttpPost("Tags/AddTag/{tagName}")]
    public async Task<ActionResult> AddTag(string tagName)
    {
        var exists = await Context.Tags.FirstOrDefaultAsync(c => c.Name == tagName);

        if (exists != null)
            return Conflict("Tag With Given Name Already Exists");

        Tag tag = new Tag
        {
            Name = tagName
        };

        await Context.Tags.AddAsync(tag);
        await Context.SaveChangesAsync();

        return Ok(tag);
    }

    [HttpGet("Tags/GetAllTags")]
    public async Task<ActionResult> GetAllTags()
    {
        var tags = await Context.Tags.ToListAsync();

        return Ok(tags);
    }

    [HttpGet("Tags/GetTagById/{id}")]
    public async Task<ActionResult> GetTagById(int id)
    {
        var tag = await Context.Tags.FirstOrDefaultAsync(c => c.Id == id);

        if (tag == null)
            return NotFound("Tag Not Found");

        return Ok(tag);
    }

    [HttpGet("Tags/GetTagByName/{tagName}")]
    public async Task<ActionResult> GetTagByName(string tagName)
    {
        var tag = await Context.Tags.FirstOrDefaultAsync(c => c.Name == tagName);

        if (tag == null)
            return NotFound("Tag Not Found");



        return Ok(tag);
    }

    [HttpPut("Tags/UpdateTagName/{tagName}/{newTagName}")]
    public async Task<ActionResult> UpdateTagName(string tagName, string newTagName)
    {
        var tag = await Context.Tags.FirstOrDefaultAsync(c => c.Name == tagName);

        if (tag == null)
            return NotFound("Tag Not Found");

        var exists = await Context.Tags.FirstOrDefaultAsync(c => c.Name == newTagName);

        if (exists != null)
            return Conflict("Tag With New Name Already Exists");

        tag.Name = newTagName;
        await Context.SaveChangesAsync();

        return Ok("Tag Update");
    }

    [HttpPut("Tags/UpdateTagNameById/{tagId}/{newTagName}")]
    public async Task<ActionResult> UpdateTagNameById(int tagId, string newTagName)
    {
        var tag = await Context.Tags.FindAsync(tagId);

        if (tag == null)
            return NotFound("Tag Not Found");

        var exists = await Context.Tags.FirstOrDefaultAsync(c => c.Name == newTagName);

        if (exists != null)
            return Conflict("Tag With New Name Already Exists");

        tag.Name = newTagName;
        await Context.SaveChangesAsync();

        return Ok("Tag Update");
    }

    [HttpPut("Tags/AddReportToTag/{tagName}/{reportId}")]
    public async Task<ActionResult> AddReportToTag(string tagName, Guid reportId)
    {
        var tag = await Context.Tags.FirstOrDefaultAsync(c => c.Name == tagName);

        if (tag == null)
            return NotFound("Tag Not Found");

        var report = await Context.Reports.FirstOrDefaultAsync(c => c.Id == reportId);

        if (report == null)
            return NotFound("Report Not Found");

        if (!tag.Reports.Any(r => r.Id == reportId))
        {
            tag.Reports.Add(report);
            await Context.SaveChangesAsync();
        }

        return Ok("Tag Added To Report");
    }

    [HttpPut("Tags/RemoveReportFromTag/{tagName}/{reportId}")]
    public async Task<ActionResult> RemoveReportFromTag(string tagName, Guid reportId)
    {
        var tag = await Context.Tags.Include(t => t.Reports).FirstOrDefaultAsync(t => t.Name == tagName);

        if (tag == null)
            return NotFound("Tag Not Found");

        var report = await Context.Reports.FirstOrDefaultAsync(r => r.Id == reportId);

        if (report == null)
            return NotFound("Report Not Found");

        if (tag.Reports.Contains(report))
        {
            tag.Reports.Remove(report);
            await Context.SaveChangesAsync();
        }

        return Ok("Report Removed from Tag");
    }

    [HttpDelete("Tags/DeleteTagByName/{tagName}")]
    public async Task<ActionResult> DeleteTagByName(string tagName)
    {
        var tag = await Context.Tags.Include(c => c.Reports).FirstOrDefaultAsync(c => c.Name == tagName);

        if (tag == null)
            return NotFound("Tag Not Found");

        foreach (var report in tag.Reports)
        {
            report.Tags.Remove(tag);
        }

        Context.Tags.Remove(tag);
        await Context.SaveChangesAsync();

        return Ok("Tag Removed");
    }

    [HttpDelete("Tags/DeleteTagById/{tagId}")]
    public async Task<ActionResult> DeleteTagById(int tagId)
    {
        var tag = await Context.Tags.Include(c => c.Reports).FirstOrDefaultAsync(c => c.Id == tagId);

        if (tag == null)
            return NotFound("Tag Not Found");

        foreach (var report in tag.Reports)
        {
            report.Tags.Remove(tag);
        }

        Context.Tags.Remove(tag);
        await Context.SaveChangesAsync();

        return Ok("Tag Removed");
    }


    //Regions

    [HttpPost("Regions/AddRegion/{regionName}")]
    public async Task<ActionResult> AddRegion(string regionName)
    {
        var exists = await Context.Regions.FirstOrDefaultAsync(c => c.Name == regionName);

        if (exists != null)
            return Conflict("Region With Given Name Already Exists");

        Region region = new Region
        {
            Name = regionName
        };

        await Context.Regions.AddAsync(region);
        await Context.SaveChangesAsync();

        return Ok("Added Region");
    }

    [HttpGet("Regions/GetAllRegions")]
    public async Task<ActionResult> GetAllRegions()
    {
        var regions = await Context.Regions.ToListAsync();

        return Ok(regions);
    }

    [HttpGet("Regions/GetRegionById/{regionId}")]
    public async Task<ActionResult> GetRegionById(int regionId)
    {
        var region = await Context.Regions.FirstOrDefaultAsync(c => c.Id == regionId);

        if (region == null)
            return NotFound("Region Not Found");

        return Ok(region);
    }

    [HttpGet("Regions/GetRegionByName/{regionName}")]
    public async Task<ActionResult> GetRegionByName(string regionName)
    {
        var region = await Context.Regions.FirstOrDefaultAsync(c => c.Name == regionName);

        if (region == null)
            return NotFound("Region Not Found");

        return Ok(region);
    }

    [HttpPut("Regions/UpdateRegionName/{regionName}/{newName}")]
    public async Task<ActionResult> UpdateRegionName(string regionName, string newName)
    {
        var region = await Context.Regions.FirstOrDefaultAsync(c => c.Name == regionName);

        if (region == null)
            return NotFound("Region Not Found");

        var exists = await Context.Regions.FirstOrDefaultAsync(c => c.Name == newName);

        if (exists != null)
            return Conflict("Region With New Name Already Exists");

        region.Name = newName;
        await Context.SaveChangesAsync();

        return Ok("Updated Region Name");
    }

    [HttpPut("Regions/UpdateRegionNameById/{regionId}/{newName}")]
    public async Task<ActionResult> UpdateRegionNameById(int regionId, string newName)
    {
        var region = await Context.Regions.FirstOrDefaultAsync(c => c.Id == regionId);

        if (region == null)
            return NotFound("Region Not Found");

        var exists = await Context.Regions.FirstOrDefaultAsync(c => c.Name == newName);

        if (exists != null)
            return Conflict("Region With New Name Already Exists");

        region.Name = newName;
        await Context.SaveChangesAsync();

        return Ok("Updated Region Name");
    }

    [HttpPut("Regions/AddRegionToReport/{regionName}/{reportId}")]
    public async Task<ActionResult> AddRegionToReport(string regionName, Guid reportId)
    {
        var region = await Context.Regions.FirstOrDefaultAsync(c => c.Name == regionName);

        if (region == null)
            return NotFound("Region Not Found");

        var report = await Context.Reports.Include(c => c.Region).FirstOrDefaultAsync(c => c.Id == reportId);

        if (report == null)
            return NotFound("Report Not Found");

        if (report.Region == null || report.Region?.Name != region.Name)
        {
            report.Region = region;
            await Context.SaveChangesAsync();
        }

        return Ok("Region Added to Report");
    }

    [HttpPut("Regions/RemoveRegionFromReport/{reportId}")]
    public async Task<ActionResult> RemoveRegionFromReport(Guid reportId)
    {
        var report = await Context.Reports.Include(r => r.Region).FirstOrDefaultAsync(r => r.Id == reportId);
        if (report == null)
            return NotFound("Report Not Found");

        report.Region = null;
        await Context.SaveChangesAsync();

        return Ok("Region Removed From Report");
    }

    [HttpDelete("Regions/DeleteRegion/{regionName}")]
    public async Task<ActionResult> DeleteRegion(string regionName)
    {
        var region = await Context.Regions.FirstOrDefaultAsync(c => c.Name == regionName);

        if (region == null)
            return NotFound("Region Not Found");

        var reports = await Context.Reports.Include(c => c.Region).Where(c => c.Region != null && c.Region.Id == region.Id).ToListAsync();

        foreach (var report in reports)
        {
            report.Region = null;
        }

        await Context.SaveChangesAsync();

        Context.Regions.Remove(region);
        await Context.SaveChangesAsync();

        return Ok("Region Deleted");
    }

    [HttpDelete("Regions/DeleteRegionById/{id}")]
    public async Task<ActionResult> DeleteRegionById(int id)
    {
        var region = await Context.Regions.FirstOrDefaultAsync(c => c.Id == id);

        if (region == null)
            return NotFound("Region Not Found");

        var reports = await Context.Reports.Include(c => c.Region).Where(c => c.Region != null && c.Region.Id == region.Id).ToListAsync();

        foreach (var report in reports)
        {
            report.Region = null;
        }

        await Context.SaveChangesAsync();

        Context.Regions.Remove(region);
        await Context.SaveChangesAsync();

        return Ok("Region Deleted");
    }

    //Resolution Status

    [HttpPost("ResolutionStatus/AddStatus/{statusName}")]
    public async Task<ActionResult> AddStatus(string statusName)
    {
        var exists = await Context.ResolutionStatuses.FirstOrDefaultAsync(c => c.Status == statusName);

        if (exists != null)
            return Conflict("Status Already Exists");

        ResolutionStatus stats = new ResolutionStatus
        {
            Status = statusName
        };

        await Context.ResolutionStatuses.AddAsync(stats);
        await Context.SaveChangesAsync();

        return Ok("Added Status");
    }

    [HttpGet("ResolutionStatus/GetAllStatuses")]
    public async Task<ActionResult> GetAllStatuses()
    {
        var statuses = await Context.ResolutionStatuses.ToListAsync();

        return Ok(statuses);
    }

    [HttpGet("ResolutionStatus/GetStatusById/{id}")]
    public async Task<ActionResult> GetStatusById(int id)
    {
        var status = await Context.ResolutionStatuses.FirstOrDefaultAsync(c => c.Id == id);

        if (status == null)
            return NotFound("Status Not Found");

        return Ok(status);
    }

    [HttpGet("ResolutionStatus/GetStatusByName/{statusName}")]
    public async Task<ActionResult> GetStatusByName(string statusName)
    {
        var status = await Context.ResolutionStatuses.FirstOrDefaultAsync(c => c.Status == statusName);

        if (status == null)
            return NotFound("Status Not Found");

        return Ok(status);
    }

    [HttpPut("ResolutionStatus/UpdateStatusName/{statusName}/{newName}")]
    public async Task<ActionResult> UpdateStatusName(string statusName, string newName)
    {
        var exists = await Context.ResolutionStatuses.FirstOrDefaultAsync(c => c.Status == newName);

        if (exists != null)
            return Conflict("Status With New Name Exists");

        var status = await Context.ResolutionStatuses.FirstOrDefaultAsync(c => c.Status == statusName);

        if (status == null)
            return NotFound("Status Not Found");

        status.Status = newName;
        await Context.SaveChangesAsync();

        return Ok("Updated Name");
    }

    [HttpPut("ResolutionStatus/UpdateStatusNameById/{statusId}/{newName}")]
    public async Task<ActionResult> UpdateStatusNameById(int statusId, string newName)
    {
        var exists = await Context.ResolutionStatuses.FirstOrDefaultAsync(c => c.Status == newName);

        if (exists != null)
            return Conflict("Status With New Name Exists");

        var status = await Context.ResolutionStatuses.FirstOrDefaultAsync(c => c.Id == statusId);

        if (status == null)
            return NotFound("Status Not Found");

        status.Status = newName;
        await Context.SaveChangesAsync();

        return Ok("Updated Name");
    }

    [HttpPut("ResolutionStatus/AddStatusToReport/{statusName}/{reportId}")]
    public async Task<ActionResult> AddStatusToReport(string statusName, Guid reportId)
    {
        var report = await Context.Reports.Include(c => c.ResolutionStatus)
                                        .FirstOrDefaultAsync(c => c.Id == reportId);

        if (report == null)
            return NotFound("Report Not Found");

        var status = await Context.ResolutionStatuses.FirstOrDefaultAsync(c => c.Status == statusName);

        if (status == null)
            return NotFound("Status Not Found");

        if (report.ResolutionStatus == null || report.ResolutionStatus?.Status != status.Status)
        {
            report.ResolutionStatus = status;
            await Context.SaveChangesAsync();
        }

        return Ok("Added Status To Report");
    }

    [HttpPut("ResolutionStatus/RemoveStatusFromReport/{reportId}")]
    public async Task<ActionResult> RemoveStatusFromReport(Guid reportId)
    {
        var report = await Context.Reports.Include(c => c.ResolutionStatus)
                                        .FirstOrDefaultAsync(c => c.Id == reportId);

        if (report == null)
            return NotFound("Report Not Found");

        report.ResolutionStatus = null;
        await Context.SaveChangesAsync();

        return Ok("Removed Status From Report");
    }

    [HttpDelete("ResolutionStatus/RemoveStatus/{statusName}")]
    public async Task<ActionResult> RemoveStatus(string statusName)
    {
        var status = await Context.ResolutionStatuses.FirstOrDefaultAsync(c => c.Status == statusName);

        if (status == null)
            return NotFound("Status Not Found");

        var reports = await Context.Reports.Include(c => c.ResolutionStatus)
                                            .Where(c => c.ResolutionStatus != null && c.ResolutionStatus.Id == status.Id)
                                            .ToListAsync();

        foreach (var report in reports)
        {
            report.ResolutionStatus = null;
        }
        await Context.SaveChangesAsync();

        Context.ResolutionStatuses.Remove(status);
        await Context.SaveChangesAsync();

        return Ok("Resolution Status Removed");
    }

    [HttpDelete("ResolutionStatus/RemoveStatusById/{id}")]
    public async Task<ActionResult> RemoveStatusById(int id)
    {
        var status = await Context.ResolutionStatuses.FirstOrDefaultAsync(c => c.Id == id);

        if (status == null)
            return NotFound("Status Not Found");

        var reports = await Context.Reports.Include(c => c.ResolutionStatus)
                                            .Where(c => c.ResolutionStatus != null && c.ResolutionStatus.Id == status.Id)
                                            .ToListAsync();

        foreach (var report in reports)
        {
            report.ResolutionStatus = null;
        }
        await Context.SaveChangesAsync();

        Context.ResolutionStatuses.Remove(status);
        await Context.SaveChangesAsync();

        return Ok("Resolution Status Removed");
    }


    //Severity

    [HttpPost("Severity/AddSeverity/{level}")]
    public async Task<ActionResult> AddSeverity(string level)
    {
        var exists = await Context.Severity.FirstOrDefaultAsync(c => c.Level == level);

        if (exists != null)
            return Conflict("Severity Level Already Exists");

        Severity severity = new Severity
        {
            Level = level
        };

        await Context.Severity.AddAsync(severity);
        await Context.SaveChangesAsync();

        return Ok("Severity Level Added");
    }

    [HttpGet("Severity/GetAllSeverities")]
    public async Task<ActionResult> GetAllSeverities()
    {
        var severities = await Context.Severity.ToListAsync();

        return Ok(severities);
    }

    [HttpGet("Severity/GetSeverityByLevel/{level}")]
    public async Task<ActionResult> GetSeverityByLevel(string level)
    {
        var severity = await Context.Severity.FirstOrDefaultAsync(c => c.Level == level);

        if (severity == null)
            return NotFound("Severity Not Found");

        return Ok(severity);
    }

    [HttpGet("Severity/GetSeverityById/{id}")]
    public async Task<ActionResult> GetSeverityById(int id)
    {
        var severity = await Context.Severity.FindAsync(id);

        if (severity == null)
            return NotFound("Severity Not Found");

        return Ok(severity);
    }

    [HttpPut("Severity/UpdateSeverityByLevel/{level}/{newLevel}")]
    public async Task<ActionResult> UpdateSeverityByLevel(string level, string newLevel)
    {
        var exists = await Context.Severity.FirstOrDefaultAsync(c => c.Level == newLevel);

        if (exists != null)
            return Conflict("Severity Level Already Exists");

        var severity = await Context.Severity.FirstOrDefaultAsync(c => c.Level == level);

        if (severity == null)
            return NotFound("Severity Not Found");

        severity.Level = newLevel;
        await Context.SaveChangesAsync();

        return Ok("Updated Severity Level");
    }

    [HttpPut("Severity/UpdateSeverityById/{id}/{newLevel}")]
    public async Task<ActionResult> UpdateSeverityById(int id, string newLevel)
    {
        var exists = await Context.Severity.FirstOrDefaultAsync(c => c.Level == newLevel);

        if (exists != null)
            return Conflict("Severity Level Already Exists");

        var severity = await Context.Severity.FirstOrDefaultAsync(c => c.Id == id);

        if (severity == null)
            return NotFound("Severity Not Found");

        severity.Level = newLevel;
        await Context.SaveChangesAsync();

        return Ok("Updated Severity Level");
    }

    [HttpPut("Severity/AddSeverityToReport/{level}/{reportId}")]
    public async Task<ActionResult> AddSeverityToReport(string level, Guid reportId)
    {
        var severity = await Context.Severity.FirstOrDefaultAsync(c => c.Level == level);

        if (severity == null)
            return NotFound("Severity Not Found");

        var report = await Context.Reports.Include(c => c.Severity).FirstOrDefaultAsync(c => c.Id == reportId);

        if (report == null)
            return NotFound("Report Not Found");

        if (report.Severity == null || report.Severity?.Level != level)
        {
            report.Severity = severity;
            await Context.SaveChangesAsync();
        }

        return Ok("Added Severity To Report");
    }

    [HttpPut("Severity/RemoveSeverityFromReport/{reportId}")]
    public async Task<ActionResult> RemoveSeverityFromReport(Guid reportId)
    {
        var report = await Context.Reports.Include(c => c.Severity).FirstOrDefaultAsync(c => c.Id == reportId);

        if (report == null)
            return NotFound("Report Not Found");

        report.Severity = null;
        await Context.SaveChangesAsync();

        return Ok("Removed Severity From Report");
    }

    [HttpDelete("Severity/RemoveSeverityByLevel/{level}")]
    public async Task<ActionResult> RemoveSeverityByLevel(string level)
    {
        var severity = await Context.Severity.Include(c => c.Reports).FirstOrDefaultAsync(c => c.Level == level);

        if (severity == null)
            return NotFound("Severity Not Found");

        foreach (var report in severity.Reports)
        {
            report.Severity = null;
        }
        await Context.SaveChangesAsync();

        Context.Severity.Remove(severity);
        await Context.SaveChangesAsync();

        return Ok("Severity Deleted");
    }

}