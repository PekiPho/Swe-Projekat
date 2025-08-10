using AutoMapper;
using Backend.Dtos;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserDto>()
            .ForMember(a => a.CommentsId, b => b.MapFrom(c => c.Comments.Select(d => d.Id).ToList()))
            .ForMember(a => a.ReportsId, b => b.MapFrom(c => c.Reports.Select(d => d.Id).ToList()))
            .ForMember(a => a.FollowingId, b => b.MapFrom(c => c.Following.Select(d => d.Id).ToList()))
            .ForMember(a => a.RoleName, b => b.MapFrom(c => c.Role != null ? c.Role.Name : ""))
            .ForMember(a => a.CreatedAt, b => b.MapFrom(c => c.CreatedAt));


        CreateMap<Media, MediaDto>()
            .ForMember(a => a.ReportId, b => b.MapFrom(c => c.Report != null ? c.Report.Id : (Guid?)null));


        CreateMap<Comment, CommentDto>()
            .ForMember(a => a.ReportId, b => b.MapFrom(c => c.Report != null ? c.Report.Id : (Guid?)null))
            .ForMember(a => a.Username, b => b.MapFrom(c => c.User != null ? c.User.Username : ""));



        CreateMap<Report, ReportDto>()
            .ForMember(a => a.CommentIds, b => b.MapFrom(c => c.Comments != null ? c.Comments.Select(d => d.Id).ToList() : new List<Guid>()))
            .ForMember(a => a.MediaIds, b => b.MapFrom(c => c.Media != null ? c.Media.Select(d => d.MediaId).ToList() : new List<Guid>()))
            .ForMember(a => a.Username, b => b.MapFrom(c => c.User != null ? c.User.Username : ""))
            .ForMember(a => a.TagNames, b => b.MapFrom(c => c.Tags.Select(d => d.Name).ToList()))
            .ForMember(a => a.RegionName, b => b.MapFrom(c => c.Region != null ? c.Region.Name : ""))
            .ForMember(a => a.ResolutionStatus, b => b.MapFrom(c => c.ResolutionStatus != null ? c.ResolutionStatus.Status : ""))
            .ForMember(a => a.SeverityLevel, b => b.MapFrom(c => c.Severity != null ? c.Severity.Level : ""))
            .ForMember(a => a.PinId, b => b.MapFrom(c => c.Pin != null ? c.Pin.Id : (Guid?)null))
            .ForMember(a => a.FollowerUsernames, b => b.MapFrom(c => c.Followers != null ? c.Followers.Select(d => d.Username).ToList() : new List<string>()));
    }
}