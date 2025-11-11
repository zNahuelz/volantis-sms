using api.Models;
using api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly JwtService _jwtService;

        public AuthController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, JwtService jwtService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtService = jwtService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var user = await _userManager.Users
                .Include(u => u.Store)
                .FirstOrDefaultAsync(u => u.Email == model.Email);

            if (user == null)
                return Unauthorized(new { message = "Credenciales incorrectas." });

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);
            if (!result.Succeeded)
                return Unauthorized(new { message = "Credenciales incorrectas." });

            var token = await _jwtService.GenerateToken(user);

            var response = new
            {
                token,
                user = new
                {
                    id = user.Id,
                    email = user.Email,
                    names = user.Names,
                    surnames = user.Surnames,
                    store = user.Store == null ? null : new
                    {
                        id = user.Store.Id,
                        name = user.Store.Name,
                        ruc = user.Store.Ruc,
                        address = user.Store.Address,
                        phone = user.Store.Phone
                    }
                }
            };

            return Ok(response);
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized(new { message = "Token inválido." });

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
                return NotFound(new { message = "Usuario no encontrado." });

            var roles = await _userManager.GetRolesAsync(user);
            var abilities = await _jwtService.GetAbilitiesForRolesAsync(roles);

            return Ok(new
            {
                user.Id,
                user.Email,
                user.Names,
                user.Surnames,
                user.StoreId,
                roles = roles,
                abilities = abilities,
                user.CreatedAt,
                user.UpdatedAt
            });
        }
    }

    public class LoginDto
    {
        public string Email { get; set; } = default!;
        public string Password { get; set; } = default!;
    }
}
