using Backend.Dtos;

namespace Backend.Controllers;


[ApiController]
[Route("[controller]")]
public class PinsController : ControllerBase
{
    private readonly ApplContext Context;

    public PinsController(ApplContext context)
    {
        Context = context;
    }

    //Create

    [HttpPost("CreatePin/{reportId}")]
    public async Task<ActionResult> CreatePin(Guid reportId, [FromBody] Pin pin)
    {
        var report = await Context.Reports.FirstOrDefaultAsync(c => c.Id == reportId);

        if (report == null)
            return NotFound("Report Not Found");

        pin.Report = report;

        await Context.Pins.AddAsync(pin);
        await Context.SaveChangesAsync();

        return Ok(pin);
    }

    //Read

    [HttpGet("GetPinsForCoordinates")]
    public async Task<ActionResult> GetPinsForCoordinates(
        [FromQuery] double south,
        [FromQuery] double east,
        [FromQuery] double north,
        [FromQuery] double west
    )
    {
        var pins = await Context.Reports.Where(c => c.Pin != null &&
                                        c.Pin.Latitude >= south && c.Pin.Latitude <= north &&
                                        c.Pin.Longitude >= west && c.Pin.Longitude <= east)
                                        .Select(c => new ReportPinDto
                                        {
                                            ReportId = c.Id,
                                            Latitude = c.Pin!.Latitude,
                                            Longitude = c.Pin!.Longitude,
                                            SeverityLevel = c.Severity != null ? c.Severity.Level : "1",
                                            ResolutionStatus = c.ResolutionStatus != null ? c.ResolutionStatus.Status : "unsolved",
                                            Tags = c.Tags.Select(c => c.Name).ToList(),
                                            Region=c.Region != null ? c.Region.Name : "None"
                                        }).ToListAsync();


        return Ok(pins);
    }

    [HttpGet("GetFilteredPins")]
    public async Task<ActionResult> GetFilteredPins(
        [FromQuery] double south,
        [FromQuery] double north,
        [FromQuery] double west,
        [FromQuery] double east,
        [FromQuery] string[]? tags,
        [FromQuery] string[]? severities,
        [FromQuery] string[]? regions,
        [FromQuery] string[]? resolutionStatuses
    )
    {
        var query = Context.Reports
        .Where(c => c.Pin != null &&
                    c.Pin.Latitude >= south &&
                    c.Pin.Latitude <= north &&
                    c.Pin.Longitude >= west &&
                    c.Pin.Longitude <= east)
        .AsQueryable();

    if (tags != null && tags.Length > 0)
        query = query.Where(c => c.Tags.Any(t => tags.Contains(t.Name)));

    if (severities != null && severities.Length > 0)
        query = query.Where(c => c.Severity != null && severities.Contains(c.Severity.Level));

    if (regions != null && regions.Length > 0)
        query = query.Where(c => c.Region != null && regions.Contains(c.Region.Name));

    if (resolutionStatuses != null && resolutionStatuses.Length > 0)
        query = query.Where(c => c.ResolutionStatus != null && resolutionStatuses.Contains(c.ResolutionStatus.Status));

    var pins = await query
        .Select(c => new ReportPinDto
        {
            ReportId = c.Id,
            Latitude = c.Pin!.Latitude,
            Longitude = c.Pin!.Longitude,
            SeverityLevel = c.Severity != null ? c.Severity.Level : "1",
            ResolutionStatus = c.ResolutionStatus != null ? c.ResolutionStatus.Status : "unsolved",
            Tags = c.Tags.Select(t => t.Name).ToList(),
            Region = c.Region != null ? c.Region.Name : "None"
        })
        .ToListAsync();

    return Ok(pins);
    }

    [HttpGet("GetPinByReport/{reportId}")]
    public async Task<ActionResult> GetPinByReport(Guid reportId)
    {
        var report = await Context.Reports.FirstOrDefaultAsync(c => c.Id == reportId);

        if (report == null)
            return NotFound("Report Not Found");

        var pin = await Context.Pins.Include(c => c.Report).FirstOrDefaultAsync(c => c.Report != null && c.Report.Id == reportId);


        if (pin == null)
            return NotFound("Pin Not Found");

        return Ok(pin);
    }


    //Update

    [HttpPut("UpdatePinLatLon/{pinId}/{lat}/{lon}")]
    public async Task<ActionResult> UpdatePinLatLon(Guid pinId, double lat, double lon)
    {
        var pin = await Context.Pins.FirstOrDefaultAsync(c => c.Id == pinId);

        if (pin == null)
            return NotFound("Pin Not Found");

        pin.Latitude = lat;
        pin.Longitude = lon;

        await Context.SaveChangesAsync();

        return Ok(pin);
    }

    //Delete

    [HttpDelete("DeletePin/{pinId}")]
    public async Task<ActionResult> DeletePin(Guid pinId)
    {
        var pin = await Context.Pins.Include(c=>c.Report).FirstOrDefaultAsync(c => c.Id == pinId);

        if (pin == null)
            return NotFound("Pin Not Found");

        var reports = await Context.Reports.Include(c => c.Pin).Where(c => c.Pin != null && c.Pin.Id == pin.Id).ToListAsync();

        foreach (var report in reports)
        {
            report.Pin = null;
        }
        await Context.SaveChangesAsync();

        Context.Pins.Remove(pin);
        await Context.SaveChangesAsync();

        return Ok("Pin Deleted");
    }
}