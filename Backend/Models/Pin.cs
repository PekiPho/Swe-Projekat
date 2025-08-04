namespace Backend.Models;

public class Pin
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    public double Latitude { get; set; }

    public double Longitude { get; set; }

    public Report? Report { get; set; }
}