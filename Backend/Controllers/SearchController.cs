using AutoMapper;
using Backend.Dtos;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class SearchController : ControllerBase
{
    private readonly ApplContext Context;

    private readonly IMapper Mapper;

    public SearchController(ApplContext context, IMapper mapper)
    {
        Context = context;
        Mapper = mapper;
    }

    [HttpGet("OnTypeReports/{query}")]
    public async Task<ActionResult> OnTypeReports(string query)
    {
        var reports = await Context.Reports.Include(c => c.Followers)
                                        .Where(c => c.Title.Contains(query))
                                        .OrderByDescending(c => c.Followers.Count)
                                        .Take(5)
                                        .ToListAsync();

        var reportsDto = Mapper.Map<List<ReportDto>>(reports);
        return Ok(reportsDto);

    }

    [HttpGet("SearchReports/{query}/{page?}")]
    public async Task<ActionResult> SearchReports(string query, int page = 1)
    {
        var reports = await Context.Reports
                                        .Include(c => c.User)
                                        .Include(c => c.Media)
                                        .Include(c => c.Comments)
                                        .Include(c => c.Followers)
                                        .Include(c => c.Region)
                                        .Include(c => c.Tags)
                                        .Include(c => c.ResolutionStatus)
                                        .Include(c => c.Severity)
                                        .Where(c => c.Title.Contains(query))
                                        .OrderByDescending(c => c.DateOfPost)
                                        .Skip((page - 1) * 50)
                                        .Take(50)
                                        .ToListAsync();

        var reportsDto = Mapper.Map<List<ReportDto>>(reports);
        return Ok(reportsDto);
    }

}