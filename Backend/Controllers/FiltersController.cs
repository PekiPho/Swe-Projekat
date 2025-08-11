using Microsoft.AspNetCore.Mvc.Filters;

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
    public async Task<ActionResult> UpdateTagName(int tagId, string newTagName)
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

        var report= await Context.Reports.FirstOrDefaultAsync(c=>c.Id==reportId);

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
        if (tag == null) return NotFound("Tag Not Found");

        var report = await Context.Reports.FirstOrDefaultAsync(r => r.Id == reportId);
        if (report == null) return NotFound("Report Not Found");

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
    public async Task<ActionResult> DeleteTagByName(int tagId)
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

    [HttpPost("Region/AddRegion/{regionName}")]
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
    public async Task<ActionResult> UpdateRegionName(int regionId, string newName)
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

        if (report.Region != null && !(report.Region.Name == region.Name))
        {
            report.Region = region;
            await Context.SaveChangesAsync();
        }

        return Ok("Region Added to Report");
    }

    [HttpPut("Regions/RemoveRegionFromReport/{regionName}/{reportId}")]
    public async Task<ActionResult> RemoveRegionFromReport(string regionName, Guid reportId)
    {
        var region = await Context.Regions.FirstOrDefaultAsync(r => r.Name == regionName);
        if (region == null)
            return NotFound("Region Not Found");

        var report = await Context.Reports.Include(r => r.Region).FirstOrDefaultAsync(r => r.Id == reportId);
        if (report == null)
            return NotFound("Report Not Found");

        if (report.Region != null && report.Region.Id == region.Id)
        {
            report.Region = null;
            await Context.SaveChangesAsync();
        }

        return Ok("Region Removed from Report");
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

}