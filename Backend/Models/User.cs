namespace Backend.Models;

public class User
{
    [Key]
    public int Id { get; set; }

    public required string Username { get; set; }

    public required string Password { get; set; }

    //[RegularExpression(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$",ErrorMessage ="Enter valid email")]
    [EmailAddress]
    public required string Email { get; set; }

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public Role Role { get; set; }

    public List<Report> Reports { get; set; } = new();

    public List<Comment> Comments { get; set; } = new();

    public List<Report> Following { get; set; } = new List<Report>();
}