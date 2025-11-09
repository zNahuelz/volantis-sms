using Microsoft.AspNetCore.Identity;

namespace volantis_sms.Models
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUser : IdentityUser
    {
        public string Names { get; set; }
        public string Surnames { get; set; }
        public int StoreId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }
        public Store Store { get; set; } = default!;

    }

}
