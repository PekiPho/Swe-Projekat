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
        var pin = await Context.Pins.FirstOrDefaultAsync(c => c.Id == pinId);

        if (pin == null)
            return NotFound("Pin Not Found");

        Context.Pins.Remove(pin);
        await Context.SaveChangesAsync();

        return Ok("Pin Deleted");
    }
}