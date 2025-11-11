using api.Data;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace api.Services
{
    public class JwtService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;

        public JwtService(AppDbContext context, IConfiguration config, UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)
        {
            _context = context;
            _config = config;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task<string> GenerateToken(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim("Names", user.Names),
                new Claim("Surnames", user.Surnames),
                new Claim("StoreId", user.StoreId.ToString())
            };

            var roles = await _userManager.GetRolesAsync(user);
            foreach (var roleName in roles)
            {
                claims.Add(new Claim("role", roleName.ToUpper()));

                var role = await _roleManager.FindByNameAsync(roleName);
                if (role != null)
                {
                    foreach (var ra in role.RoleAbilities)
                    {
                        claims.Add(new Claim("Ability", ra.Ability.Key));
                    }
                }
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: null,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<List<object>> GetAbilitiesForRolesAsync(IEnumerable<string> roleNames)
        {
            return await _context.Roles
                .Where(r => roleNames.Contains(r.Name))
                .Include(r => r.RoleAbilities)
                    .ThenInclude(ra => ra.Ability)
                .SelectMany(r => r.RoleAbilities.Select(ra => new
                {
                    ra.Ability.Name,
                    ra.Ability.Key,
                } as object))
                .Distinct()
                .ToListAsync();
        }
    }
}
