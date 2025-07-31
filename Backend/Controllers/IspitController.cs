namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class IspitController : ControllerBase
{
    public ApplContext Context { get; set; }

    public IspitController(ApplContext context)
    {
        Context = context;
    }
    
}
