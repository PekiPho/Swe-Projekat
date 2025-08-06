namespace Backend.Dtos;

public class UpdateUserRequest
{
    public string Username { get; set; } = null!;

    public string? NewPassword { get; set; }

    public string? NewEmail { get; set; }

    public string? NewUsername { get; set; }
}