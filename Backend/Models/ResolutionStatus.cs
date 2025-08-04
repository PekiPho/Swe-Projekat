namespace Backend.Models;

public class ResolutionStatus
{
    [Key]
    public int Id { get; set; }

    public required string Status { get; set; }

    public List<Report> Reports { get; set; } = new();
}