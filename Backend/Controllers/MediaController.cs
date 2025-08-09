namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class MediaController : ControllerBase
{
    private readonly ApplContext Context;

    public MediaController(ApplContext context)
    {
        Context = context;
    }


    //Create

    [HttpPost("UploadMedia")]
    public async Task<ActionResult> UploadMedia([FromForm] List<IFormFile> mediaFiles)
    {
        if (mediaFiles == null || mediaFiles.Count == 0)
            return NotFound("No Media Files Found");

        var imagesCount = mediaFiles.Count(c => c.ContentType.StartsWith("image"));

        if (imagesCount == 0)
            return NotFound("No Images Found");

        var mediaList = new List<Media>();

        var images = mediaFiles.Where(c => c.ContentType.StartsWith("image")).ToList();

        string upload = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!Directory.Exists(upload))
            Directory.CreateDirectory(upload);

        foreach (var image in images)
        {
            var newGuid = Guid.NewGuid();
            string name = $"{newGuid}_{image.FileName}";
            string path = Path.Combine(upload, name);

            using (var stream = new FileStream(path, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            var file = new Media
            {
                MediaId = newGuid,
                Url = $"/uploads/{name}"
            };

            await Context.Media.AddAsync(file);
            mediaList.Add(file);
        }

        await Context.SaveChangesAsync();
        return Ok(mediaList);

    }

    //Read

    [HttpGet("GetMediaFromReport/{reportId}")]
    public async Task<ActionResult> GetMediaFromReport(Guid reportId)
    {
        try
        {
            var media = await Context.Media.Include(c => c.Report).Where(c => c.Report.Id == reportId).ToListAsync();

            if (!media.Any())
                return NotFound("No Media Found");

            return Ok(media);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Error while fetching media");
        }
    }

    //Update


    //Delete

    [HttpDelete("DeleteMediaFromReport/{reportId}")]
    public async Task<ActionResult> DeleteMediaFromReport(Guid reportId)
    {
        try
        {
            var media = await Context.Media.Include(c => c.Report)
                                        .Where(c => c.Report.Id == reportId)
                                        .ToListAsync();

            if (!media.Any())
                return Ok("No Media Found in the first place");

            Context.Media.RemoveRange(media);

            await Context.SaveChangesAsync();

            return Ok("Delete Media From Report");
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Error Deleting Media");
        }
    }
}