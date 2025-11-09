
namespace volantis_sms.Data.Seeders
{
    public class StoreSeeder : ISeeder
    {
        public async Task SeedAsync(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<ApplicationDbContext>();

            if (context.Stores.Any()) return;

            context.Stores.Add(new Models.Store
            {
                Name = "TIENDA PRICIPAL",
                RUC = "20117788994",
                Address = "Av. El Palacio Real 504 - Miraflores",
                Phone = "999888777",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            await context.SaveChangesAsync();
        }
    }
}
