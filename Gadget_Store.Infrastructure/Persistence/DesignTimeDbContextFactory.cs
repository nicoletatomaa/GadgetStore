using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace GadgetStore.Infrastructure.Persistence;

// Folosit DOAR de EF Core tools la generarea migrarilor (dotnet ef migrations add).
// Connection string-ul poate fi suprascris cu env var: ConnectionStrings__DefaultConnection
public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<GadgetStoreDbContext>
{
    public GadgetStoreDbContext CreateDbContext(string[] args)
    {
        var connectionString =
            Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection")
            ?? "Data Source=DESKTOP-F12TVSC;Database=GadgetStoreDb;Persist Security Info=True;User ID=sa;Password=Simba2024@;Pooling=False;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;";

        var optionsBuilder = new DbContextOptionsBuilder<GadgetStoreDbContext>();
        optionsBuilder.UseSqlServer(connectionString);

        return new GadgetStoreDbContext(optionsBuilder.Options);
    }
}
