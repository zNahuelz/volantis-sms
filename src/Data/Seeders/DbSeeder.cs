using Microsoft.EntityFrameworkCore;

namespace volantis_sms.Data.Seeders
{
    public class DbSeeder
    {
        public static async Task SeedAsync(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<ApplicationDbContext>();
            await context.Database.MigrateAsync();

            var seeders = new List<ISeeder>
            {
    new StoreSeeder(),
    new RoleSeeder(),
    new AbilitySeeder(),
    new PaymentTypeSeeder(),
    new VoucherSeeder(),
    new UserSeeder(),
            };

            foreach (var seeder in seeders)
                await seeder.SeedAsync(serviceProvider);
        }
    }
}
