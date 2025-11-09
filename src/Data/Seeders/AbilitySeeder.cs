
using Microsoft.AspNetCore.Identity;
using volantis_sms.Models;

namespace volantis_sms.Data.Seeders
{
    public class AbilitySeeder : ISeeder
    {
        public async Task SeedAsync(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<ApplicationDbContext>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<ApplicationRole>>();

            if (context.Abilities.Any()) return;

            var abilities = new[]
            {
                new Ability { Name = "Permisos administrativos.", Key = "sys:root", Description ="Acceso total al sistema.", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            };

            context.Abilities.AddRange(abilities);
            await context.SaveChangesAsync();

            var adminRole = await roleManager.FindByNameAsync("Administrador");

            foreach (var ability in abilities)
            {
                context.RoleAbilities.Add(new RoleAbility
                {
                    RoleId = adminRole!.Id,
                    AbilityId = ability.Id
                });
            }

            await context.SaveChangesAsync();
        }
    }
}
