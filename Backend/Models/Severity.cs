namespace Backend.Models;

public class Severity
{
    [Key]
    public int Id { get; set; }

    public required string Level { get; set; }

    public List<Report> Reports { get; set; } = new();
}