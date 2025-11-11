namespace api.Data.Seeders
{
    public class StoreSeeder : ISeeder
    {
        public async Task SeedAsync(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<AppDbContext>();

            if (context.Stores.Any()) return;

            context.Stores.Add(new Models.Store
            {
                Name = "TIENDA PRICIPAL",
                Ruc = "20117788994",
                Address = "Av. El Palacio Real 504 - Miraflores",
                Phone = "999888777",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            });

            await context.SaveChangesAsync();
        }
    }
}
