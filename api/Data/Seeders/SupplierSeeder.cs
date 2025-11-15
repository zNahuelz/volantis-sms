using api.Models;
using api.Utils;
using Bogus;

namespace api.Data.Seeders
{
    public class SupplierSeeder : ISeeder
    {
        public async Task SeedAsync(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<AppDbContext>();
            if (context.Suppliers.Any()) return;
            var usedRucs = new HashSet<string>();
            var faker = new Bogus.Faker("es_MX");
            var suppliers = new Faker<Supplier>("es_MX")
                .RuleFor(s => s.Name, f => f.Company.CompanyName().Truncate(100))
                .RuleFor(s => s.Ruc, f =>
                {
                    string ruc;

                    do
                    {
                        ruc = f.Random.Long(10000000000, 99999999999).ToString();
                    }
                    while (!usedRucs.Add(ruc));

                    return ruc;
                })
                .RuleFor(s => s.Phone, f => f.Phone.PhoneNumber().Truncate(15))
                .RuleFor(s => s.Email, f => f.Internet.Email().Truncate(50))
                .RuleFor(s => s.Address, f => f.Address.FullAddress().Truncate(150))
                .RuleFor(s => s.UpdatedAt, f => DateTime.UtcNow)
                .Generate(100);
            await context.Suppliers.AddRangeAsync(suppliers);
            await context.SaveChangesAsync();
        }

    }
}
