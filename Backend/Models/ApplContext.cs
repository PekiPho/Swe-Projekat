namespace Backend.Models;

public class ApplContext : DbContext
{
    public DbSet<User> Users { get; set; }

    public DbSet<Report> Reports { get; set; }

    public DbSet<Region> Regions { get; set; }

    public DbSet<Comment> Comments { get; set; }

    public DbSet<Media> Media { get; set; }

    public DbSet<Tag> Tags { get; set; }

    public DbSet<Pin> Pins { get; set; }

    public DbSet<ResolutionStatus> ResolutionStatuses { get; set; }

    public DbSet<Severity> Severity { get; set; }

    public DbSet<Role> Roles { get; set; }

    public ApplContext(DbContextOptions options) : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

         modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Username).IsUnique();
        });

        modelBuilder.Entity<Report>()
            .HasOne(r => r.User)
            .WithMany(u => u.Reports)
            .HasForeignKey("AuthorId")
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<User>()
            .HasMany(u => u.Following)
            .WithMany(r => r.Followers)
            .UsingEntity<Dictionary<string, object>>(
            "UserFollowsReport",
            j => j.HasOne<Report>().WithMany().HasForeignKey("ReportId"),
            j => j.HasOne<User>().WithMany().HasForeignKey("UserId"));
    }
}
