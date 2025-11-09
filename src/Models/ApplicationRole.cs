using Microsoft.AspNetCore.Identity;

namespace volantis_sms.Models
{
    public class ApplicationRole : IdentityRole
    {
        public ICollection<RoleAbility> RoleAbilities { get; set; } = new List<RoleAbility>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
