using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using Backend.Dtos;

namespace Backend.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly ApplContext Context;

    public UserController(ApplContext context)
    {
        Context = context;
    }

    //Create

    [HttpPost("AddUser")]
    public async Task<ActionResult> AddUser([FromBody] User user)
    {
        try
        {
            var hasher = new PasswordHasher<User>();
            user.Password = hasher.HashPassword(user, user.Password);

            await Context.Users.AddAsync(user);
            await Context.SaveChangesAsync();

            var claims = new[]{
                new Claim(Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames.Sub,user.Email),
                new Claim(Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames.Jti,user.Id.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: "http://localhost:4200",
                audience: "http://localhost:4200",
                claims: claims,
                expires: DateTime.UtcNow.AddMonths(1),
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes("OvoJeNasKljucZaEnkriptovanjeKojiUpravoIzmisljamDokPisemAkoNekoOvoCitaZasto?")), SecurityAlgorithms.HmacSha256)
            );


            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo
            });
        }
        catch (DbUpdateException ex)
        {
            if (ex.InnerException != null && ex.InnerException.Message.Contains("Cannot insert duplicate key"))
            {
                return Conflict("User with given username already exists");
            }

            return UnprocessableEntity("An Error occurred while adding the user");
        }

    }


    //Read

    [Authorize]
    [HttpGet("GetEntry")]
    public async Task<ActionResult> GetEntry()
    {
        var userId = User.FindFirst("jti")?.Value;

        if (userId == null)
            return Unauthorized("No userId");

        var user = await Context.Users.FindAsync(int.Parse(userId));

        if (user == null)
            return NotFound("User NOT found");

        return Ok(user);
    }

    [HttpGet("GetUserById/{id}")]
    public async Task<ActionResult> GetUserById(int id)
    {
        var user = await Context.Users.FindAsync(id);

        if (user == null)
        {
            return NotFound("User with given ID does not exist");
        }

        return Ok(user);
    }

    [HttpGet("GetUserByUsername/{username}")]
    public async Task<ActionResult> GetUserByUsername(string username)
    {
        var user = await Context.Users.FirstOrDefaultAsync(c => c.Username == username);

        if (user == null)
            return NotFound("User with given Username does not exist");

        return Ok(user);
    }

    [HttpGet("GetUserByMailAndPassword/{email}/{password}")]
    public async Task<ActionResult> GetUserByMailAndPassword(string email, string password)
    {
        var users = await Context.Users.Where(c => c.Email == email).ToListAsync();

        User? user = null;
        var hasher = new PasswordHasher<User>();

        foreach (var u in users)
        {
            if (hasher.VerifyHashedPassword(u, u.Password, password) == PasswordVerificationResult.Success)
            {
                user = u;
                break;
            }
        }

        if (user == null)
            return NotFound("User not found");

        var claims = new[]{
            new Claim(Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames.Sub,user.Email),
            new Claim(Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames.Jti,user.Id.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: "http://localhost:4200",
            audience: "http://localhost:4200",
            claims: claims,
            expires: DateTime.Now.AddDays(7),
            signingCredentials: new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes("OvoJeNasKljucZaEnkriptovanjeKojiUpravoIzmisljamDokPisemAkoNekoOvoCitaZasto?")), SecurityAlgorithms.HmacSha256)
        );

        return Ok(new
        {
            token = new JwtSecurityTokenHandler().WriteToken(token),
            expiration = token.ValidTo,
        });
    }


    //Update

    [HttpPut("UpdateUserPassword")]
    public async Task<ActionResult> UpdateUserPassword([FromBody] UpdateUserRequest request)
    {
        var user = await Context.Users.FirstOrDefaultAsync(c => c.Username == request.Username);

        if (user == null)
            return NotFound("User with given username NOT FOUND");

        var hasher = new PasswordHasher<User>();

        user.Password = hasher.HashPassword(user, request.NewPassword!);

        Context.Users.Update(user);

        await Context.SaveChangesAsync();

        return Ok("Password updated successfully");
    }

    [HttpPut("UpdateUserUsername")]
    public async Task<ActionResult> UpdateUserUsername([FromBody] UpdateUserRequest request)
    {
        var isUnique = await Context.Users.FirstOrDefaultAsync(c => c.Username == request.NewUsername);

        if (isUnique != null)
            return Conflict("User with new username already exists");


        var user = await Context.Users.FirstOrDefaultAsync(c => c.Username == request.Username);

        if (user == null)
            return NotFound("User with given username NOT FOUND");

        user.Username = request.NewUsername!;

        Context.Users.Update(user);

        await Context.SaveChangesAsync();

        return Ok("Username updated successfully");
    }

    [HttpPut("UpdateUserEmail")]
    public async Task<ActionResult> UpdateUserEmail([FromBody] UpdateUserRequest request)
    {
        var emailCheck = new EmailAddressAttribute();
        if (!emailCheck.IsValid(request.NewEmail))
            return BadRequest("Email entered is NOT a valid Email address");

        var user = await Context.Users.FirstOrDefaultAsync(c => c.Username == request.Username);

        if (user == null)
            return NotFound("User with given username NOT FOUND");

        user.Email = request.NewEmail!;

        Context.Users.Update(user);

        await Context.SaveChangesAsync();

        return Ok("Email updated successfully");
    }


    //Delete
    //Need to make deleting comments

    [HttpDelete("DeleteUserByID/{id}")]
    public async Task<ActionResult> DeleteUserById(int id)
    {
        var user = await Context.Users.FindAsync(id);

        if (user == null)
            return NotFound("User NOT found");

        Context.Users.Remove(user);

        await Context.SaveChangesAsync();

        return Ok("User Removed");
    }

    [HttpDelete("DeleteUserByUsername/{username}")]
    public async Task<ActionResult> DeleteUserByUsername(string username)
    {
        var user = await Context.Users
                                .Include(c => c.Reports)
                                .Include(c => c.Comments)
                                .Include(c => c.Following)
                                .FirstOrDefaultAsync(c => c.Username == username);

        if (user == null)
            return NotFound("User with given Username NOT found");

        foreach (var report in user.Following.ToList())
        {
            report.Followers.Remove(user);
        }

        if (user.Comments.Any())
            Context.Comments.RemoveRange(user.Comments);

        foreach (var report in user.Reports.ToList())
        {
            await DeleteReportInternal(report.Id);
        }

        Context.Users.Remove(user);

        await Context.SaveChangesAsync();

        return Ok("User removed");
    }

    private async Task DeleteReportInternal(Guid reportId)
    {
        var report = await Context.Reports.Include(c => c.User)
                                            .Include(c => c.Media)
                                            .Include(c => c.Comments)
                                            .Include(c => c.Followers)
                                            .Include(c => c.Region)
                                            .Include(c => c.Tags)
                                            .Include(c => c.ResolutionStatus)
                                            .Include(c => c.Severity)
                                            .FirstOrDefaultAsync(c => c.Id == reportId);

        if (report == null)
            return;

        if (report.Comments != null && report.Comments.Any())
            Context.Comments.RemoveRange(report.Comments);

        foreach (var user in report.Followers.ToList())
            user.Following.Remove(report);

        if (report.User != null)
            report.User.Reports.Remove(report);

        if (report.Media != null && report.Media.Any())
            Context.Media.RemoveRange(report.Media);

        if (report.Pin != null)
            Context.Pins.Remove(report.Pin);

        Context.Reports.Remove(report);

        await Context.SaveChangesAsync();
    }  

}
