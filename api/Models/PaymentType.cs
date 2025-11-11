using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    [Index(nameof(Name), IsUnique = true)]
    public class PaymentType
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(20)]
        public string Name { get; set; } = default!;
        public ICollection<Sale> Sales { get; set; } = new List<Sale>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
