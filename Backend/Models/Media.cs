namespace Backend.Models;

public class Media
{
    [Key]
    public Guid MediaId { get; set; } = Guid.NewGuid();

    public required string Url { get; set; }

    public Report? Report { get; set; }
}