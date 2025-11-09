
using volantis_sms.Models;

namespace volantis_sms.Data.Seeders
{
    public class PaymentTypeSeeder : ISeeder
    {
        public async Task SeedAsync(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<ApplicationDbContext>();

            if (context.PaymentTypes.Any()) return;

            context.PaymentTypes.AddRange(new[]
            {
                new PaymentType { Name = "EFECTIVO", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new PaymentType { Name = "TARJETA", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow  },
                new PaymentType { Name = "YAPE", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow  },
                new PaymentType { Name = "PLIN", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow  },
            });

            await context.SaveChangesAsync();
        }
    }
}
