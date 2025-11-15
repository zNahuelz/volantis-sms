using Microsoft.EntityFrameworkCore;

namespace api.Data.Seeders
{
    public class DbSeeder
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<AppDbContext>();
            await context.Database.MigrateAsync();

            var seeders = new List<ISeeder>
            {
                new StoreSeeder(),
                new RoleSeeder(),
                new AbilitySeeder(),
                new PaymentTypeSeeder(),
                new VoucherSeeder(),
                new UserSeeder(),
                new SupplierSeeder(),
            };

            foreach (var seeder in seeders)
                await seeder.SeedAsync(serviceProvider);
        }
    }
}
