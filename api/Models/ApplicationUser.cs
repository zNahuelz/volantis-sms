using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class ApplicationUser : IdentityUser
    {
        [Required]
        [MaxLength(30)]
        public string Names { get; set; }
        [Required]
        [MaxLength(30)]
        public string Surnames { get; set; }
        public int StoreId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }
        public Store Store { get; set; } = default!;

    }
}
