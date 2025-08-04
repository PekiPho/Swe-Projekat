namespace Backend.Models;


public class Region
{
    [Key]
    public int Id { get; set; }

    public required string Name { get; set; }
}