namespace Backend.Models;


public class Role
{
    [Key]
    public int Id { get; set; }

    public required string Name { get; set; }

    public Region? Region { get; set; }

    public List<User> Users { get; set; } = new();
}