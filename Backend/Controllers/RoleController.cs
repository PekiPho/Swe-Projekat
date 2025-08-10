using Microsoft.EntityFrameworkCore.Query;
using Microsoft.Extensions.FileProviders;

namespace Backend.Controllers;


[ApiController]
[Route("[controller]")]
public class RoleController : ControllerBase
{
    private readonly ApplContext Context;

    public RoleController(ApplContext context)
    {
        Context = context;
    }

    //Create

    [HttpPost("AddRole/{roleName}")]
    public async Task<ActionResult> AddRole(string roleName)
    {
        var exists = await Context.Roles.AnyAsync(c => c.Name == roleName);
        if (exists)
            return Conflict("Role Already Exists");

        Role role = new Role
        {
            Name = roleName
        };



        await Context.Roles.AddAsync(role);
        await Context.SaveChangesAsync();

        return Ok("Role Added");

    }


    //Read

    [HttpGet("GetRoles")]
    public async Task<ActionResult> GetRoles()
    {
        var roles = await Context.Roles.ToListAsync();

        return Ok(roles);
    }

    [HttpGet("GetRoleByName/{roleName}")]
    public async Task<ActionResult> GetRoleByName(string roleName)
    {
        var role = await Context.Roles.Include(c => c.Region)
                                    .FirstOrDefaultAsync(c => c.Name == roleName);

        if (role == null)
            return NotFound("Role Not Found");


        return Ok(role);
    }

    [HttpGet("GetRoleById/{id}")]
    public async Task<ActionResult> GetRoleById(int id)
    {
        var role = await Context.Roles.Include(c => c.Region).FirstOrDefaultAsync(c => c.Id == id);

        if (role == null)
            return NotFound("Role Not Found");

        return Ok(role);
    }

    [HttpGet("GetUsersByRole/{roleName}")]
    public async Task<ActionResult> GetUsersByRole(string roleName)
    {
        var role = await Context.Roles.Include(c => c.Users).FirstOrDefaultAsync(c => c.Name == roleName);

        if (role == null)
            return NotFound("Role Not Found");

        return Ok(role.Users);
    }

    [HttpGet("GetUserRole/{username}")]
    public async Task<ActionResult> GetUserRole(string username)
    {
        var user = await Context.Users.Include(c=>c.Role).FirstOrDefaultAsync(c => c.Username == username);

        if (user == null)
            return NotFound("User Not Found");

        return Ok(user.Role);
    }

    //Update

    [HttpPut("UpdateRegionToRole/{roleName}/{regionName}")]
    public async Task<ActionResult> UpdateRegionToRole(string roleName, string regionName)
    {
        var role = await Context.Roles.FirstOrDefaultAsync(c => c.Name == roleName);

        var region = await Context.Regions.FirstOrDefaultAsync(c => c.Name == regionName);

        if (role == null)
            return NotFound("Role Not Found");

        if (region == null)
            return NotFound("Region Not Found");

        role.Region = region;

        await Context.SaveChangesAsync();

        return Ok("Region Updated For Role");
    }


    [HttpPut("UpdateRoleName/{currName}/{newName}")]
    public async Task<ActionResult> UpdateRoleName(string currName, string newName)
    {
        var role = await Context.Roles.FirstOrDefaultAsync(c => c.Name == currName);

        if (role == null)
            return NotFound("Role Not Found");

        var exists = await Context.Roles.AnyAsync(c => c.Name == newName);

        if (exists)
            return Conflict("Role With New Name Exists");

        role.Name = newName;
        await Context.SaveChangesAsync();

        return Ok("Role Name Updated");
    }

    [HttpPut("GiveUserARole/{username}/{roleName}")]
    public async Task<ActionResult> GiveUserARole(string username, string roleName)
    {
        var user = await Context.Users.Include(c => c.Role).FirstOrDefaultAsync(c => c.Username == username);

        if (user == null)
            return NotFound("User Not Found");

        var role = await Context.Roles.FirstOrDefaultAsync(c => c.Name == roleName);

        if (role == null)
            return NotFound("Role Not Found");

        user.Role = role;

        await Context.SaveChangesAsync();

        return Ok("User Assigned A Role");
    }

    [HttpPut("RemoveRoleFromUser/{username}")]
    public async Task<ActionResult> RemoveRoleFromUser(string username)
    {
        var user = await Context.Users.Include(c => c.Role).FirstOrDefaultAsync(c => c.Username == username);

        if (user == null)
            return NotFound("User Not Found");

        user.Role = null;
        await Context.SaveChangesAsync();

        return Ok("Role Removed From User");
    }


    //Delete

    [HttpDelete("DeleteRole/{roleName}")]
    public async Task<ActionResult> DeleteRole(string roleName)
    {
        var role = await Context.Roles.Include(c => c.Users)
                                        .FirstOrDefaultAsync(c => c.Name == roleName);

        if (role == null)
            return NotFound("Role Not Found");

        foreach (var user in role.Users)
        {
            user.Role = null;
        }

        Context.Roles.Remove(role);
        await Context.SaveChangesAsync();

        return Ok("Role Deleted");
    }

    [HttpDelete("DeleteRegionFromRole/{roleName}")]
    public async Task<ActionResult> DeleteRegionFromRole(string roleName)
    {
        var role = await Context.Roles.Include(c => c.Region).FirstOrDefaultAsync(c => c.Name == roleName);

        if (role == null)
            return NotFound("Role Not Found");

        role.Region = null;
        await Context.SaveChangesAsync();

        return Ok("Region Deleted From Role");
    }
}