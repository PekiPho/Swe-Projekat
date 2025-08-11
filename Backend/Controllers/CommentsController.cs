using Azure;
using Backend.Dtos;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class CommentsController : ControllerBase
{
    private readonly ApplContext Context;
    public CommentsController(ApplContext context)
    {
        Context = context;
    }

    //Create

    [HttpPost("CreateComment/{username}/{reportId}")]
    public async Task<ActionResult> CreateComment(string username, Guid reportId, [FromBody] Comment comment)
    {
        var user = await Context.Users.FirstOrDefaultAsync(c => c.Username == username);
        var report = await Context.Reports.FirstOrDefaultAsync(c => c.Id == reportId);

        if (user == null)
            return NotFound("User Not Found");

        if (report == null)
            return NotFound("Report Not Found");

        comment.Report = report;
        comment.User = user;

        await Context.Comments.AddAsync(comment);
        await Context.SaveChangesAsync();


        return Ok("Comment added");
    }

    //Read

    [HttpGet("GetCommentsFromReport/{reportId}/{page?}")]
    public async Task<ActionResult> GetCommentsFromReport(Guid reportId, int page = 1)
    {
        var report = await Context.Reports.FirstOrDefaultAsync(c => c.Id == reportId);

        if (report == null)
            return NotFound("Report Not Found");

        var comments = await Context.Comments.Include(c => c.User)
                                                .Include(c => c.Report)
                                                .Where(c => c.Report != null && c.Report.Id == report.Id)
                                                .Skip((page - 1) * 50)
                                                .Take(50)
                                                .ToListAsync();

        return Ok(comments);
    }


    [HttpGet("GetComment/{commentId}")]
    public async Task<ActionResult> GetComment(Guid commentId)
    {
        var comment = await Context.Comments.Include(c => c.User)
                                            .Include(c => c.Report)
                                            .FirstOrDefaultAsync(c => !c.IsDeleted  && c.Id == commentId);

        if (comment == null)
            return NotFound("Comment Not Found");

        return Ok(comment);
    }


    [HttpGet("GetCommentsFromUser/{username}/{page?}")]
    public async Task<ActionResult> GetCommentsFromUser(string username, int page = 1)
    {
        var user = await Context.Users.FirstOrDefaultAsync(c => c.Username == username);

        if (user == null)
            return NotFound("User Not Found");

        var comments = await Context.Comments.Include(c => c.User)
                                                .Include(c => c.Report)
                                                .Where(c => c.User != null && !c.IsDeleted && c.User.Username == user.Username)
                                                .Skip((page - 1) * 50)
                                                .Take(50)
                                                .ToListAsync();

        return Ok(comments);
    }

    //Update

    [HttpPut("UpdateCommentContent/{commentId}")]
    public async Task<ActionResult> UpdateCommentContent(Guid commentId, [FromBody] UpdateCommentDto commentContent)
    {
        if (commentContent.Content == null)
            return BadRequest("New Comment Content is empty");

        var comment = await Context.Comments.FirstOrDefaultAsync(c => c.Id == commentId);

        if (comment == null)
            return NotFound("Comment Not Found");

        comment.Content = commentContent.Content;

        Context.Comments.Update(comment);
        await Context.SaveChangesAsync();


        return Ok(comment);
    }

    //Delete


    [HttpDelete("DeleteComment/{commentId}")]
    public async Task<ActionResult> DeleteComment(Guid commentId)
    {
        var comment = await Context.Comments.FirstOrDefaultAsync(c => c.Id == commentId);

        if (comment == null || comment.IsDeleted)
            return NotFound("Comment Not Found");

        comment.IsDeleted = true;

        await Context.SaveChangesAsync();

        return Ok("Comment Deleted");
    }
}