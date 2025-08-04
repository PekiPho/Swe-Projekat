namespace Backend.Models;


public class Report
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public required string Title { get; set; }

    [MaxLength(2000)]
    public string? Description { get; set; }

    public DateTimeOffset DateOfPost { get; set; } = DateTimeOffset.UtcNow;

    public User? User { get; set; }

    public List<Comment> Comments { get; set; } = new();

    public List<Media>? Media { get; set; }

    public Region Region { get; set; }

    public Severity Severity { get; set; }

    public ResolutionStatus ResolutionStatus { get; set; }

    public List<Tag> Tags { get; set; } = new List<Tag>();

    public List<User> Followers { get; set; } = new List<User>();
}