
using api.Models;
using Microsoft.AspNetCore.Identity;

namespace api.Data.Seeders
{
    public class RoleSeeder : ISeeder
    {
        public async Task SeedAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<ApplicationRole>>();

            if (roleManager.Roles.Any()) return;

            var roles = new[]
            {
                new ApplicationRole { Name = "Administrador", NormalizedName = "ADMINISTRADOR" },
                new ApplicationRole { Name = "Gerente", NormalizedName = "GERENTE" },
                new ApplicationRole { Name = "Vendedor", NormalizedName = "VENDEDOR" },
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }
        }
    }
}
