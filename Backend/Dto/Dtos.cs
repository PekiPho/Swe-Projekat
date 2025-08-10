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


public class UserDto
{
    public int Id { get; set; }

    public string? Username { get; set; }

    public string? Email { get; set; }

    public string? RoleName { get; set; }

    public List<Guid>? ReportsId { get; set; }

    public List<Guid>? FollowingId { get; set; }

    public List<Guid>? CommentsId { get; set; }

    public DateTimeOffset CreatedAt { get; set; }
}


public class MediaDto
{
    public Guid MediaId { get; set; }

    public string? Url { get; set; }

    public Guid? ReportId { get; set; }
}

public class CommentDto
{
    public Guid Id { get; set; }

    public Guid? ReportId { get; set; }

    public string? Content { get; set; }

    public string? Username { get; set; }

    public bool IsDeleted { get; set; }

    public DateTimeOffset DateOfComment { get; set; }
}


public class ReportDto
{
    public Guid Id { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public DateTimeOffset DateOfPost { get; set; }

    public string? Username { get; set; }

    public List<Guid>? CommentIds { get; set; }

    public List<Guid>? MediaIds { get; set; }

    public string? RegionName { get; set; }

    public string? SeverityLevel { get; set; }

    public string? ResolutionStatus { get; set; }

    public Guid? PinId { get; set; }

    public List<string>? TagNames { get; set; }

    public List<string>? FollowerUsernames { get; set; }
}