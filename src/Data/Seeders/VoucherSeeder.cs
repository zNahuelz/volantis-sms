
using volantis_sms.Models;

namespace volantis_sms.Data.Seeders
{
    public class VoucherSeeder : ISeeder
    {
        public async Task SeedAsync(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<ApplicationDbContext>();

            if (context.VoucherTypes.Any()) return;

            var boleta = new VoucherType
            {
                Name = "BOLETA",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var factura = new VoucherType
            {
                Name = "FACTURA",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            context.VoucherTypes.AddRange(boleta, factura);
            await context.SaveChangesAsync();

            context.VoucherSeries.AddRange(
               new VoucherSeries
               {
                   SeriesCode = "B001",
                   CurrentNumber = 1,
                   IsActive = true,
                   VoucherTypeId = boleta.Id,
                   CreatedAt = DateTime.UtcNow,
                   UpdatedAt = DateTime.UtcNow
               },
                new VoucherSeries
                {
                    SeriesCode = "F001",
                    CurrentNumber = 1,
                    IsActive = true,
                    VoucherTypeId = factura.Id,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                }
            );

            await context.SaveChangesAsync();
        }
    }
}
