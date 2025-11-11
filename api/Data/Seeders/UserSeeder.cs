
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api.Data.Seeders
{
    public class UserSeeder : ISeeder
    {
        public async Task SeedAsync(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<ApplicationRole>>();
            var context = serviceProvider.GetRequiredService<AppDbContext>();

            if (await userManager.Users.AnyAsync()) return;

            var store = await context.Stores.FirstOrDefaultAsync();
            if (store == null)
                throw new InvalidOperationException("[ERROR] : No se encontraron tiendas, la base de datos debe contener una tienda inicial.");

            var admin = new ApplicationUser
            {
                UserName = "admin",
                Email = "admin@volantis.com",
                EmailConfirmed = true,
                Names = "Administrador",
                Surnames = "--------------",
                StoreId = store.Id,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            var result = await userManager.CreateAsync(admin, "ADMInistrador2020@");
            if (!result.Succeeded)
                throw new Exception($"Failed to create admin: {string.Join(", ", result.Errors.Select(e => e.Description))}");

            if (await roleManager.RoleExistsAsync("Administrador"))
                await userManager.AddToRoleAsync(admin, "Administrador");
            else
                throw new Exception("[ERROR] : Rol: Administrador no existe.");

        }
    }
}
