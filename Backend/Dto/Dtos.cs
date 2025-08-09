namespace Backend.Dtos;

public class UpdateUserRequest
{
    public string Username { get; set; } = null!;

    public string? NewPassword { get; set; }

    public string? NewEmail { get; set; }

    public string? NewUsername { get; set; }
}

public class UpdateReportDto
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? RegionName { get; set; }
    public string? SeverityLevel { get; set; }
    public string? ResolutionStatus { get; set; }
    public List<string> Tags { get; set; } = new();
}

public class UpdateCommentDto
{
    public string? Content { get; set; }
}