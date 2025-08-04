namespace Backend.Models;


public class Tag
{
    [Key]
    public int Id { get; set; }

    public required string Name { get; set; }

    public List<Report> Reports { get; set; } = new List<Report>();
}