namespace Backend.Models;

public class ApplContext : DbContext
{
    // DbSet kolekcije!

    public ApplContext(DbContextOptions options) : base(options)
    {
        
    }
}
