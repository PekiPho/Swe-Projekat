namespace Backend.Models;


public class Comment
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public Report? Report { get; set; }

    public required string Content { get; set; }

    public User? User { get; set; }

    public bool IsDeleted { get; set; } = false;

    public DateTimeOffset DateOfComment { get; set; } = DateTimeOffset.UtcNow;
}