using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    [Index(nameof(Ruc), IsUnique = true)]
    public class Supplier
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = default!;
        [Required]
        [MaxLength(20)]
        public string Ruc { get; set; } = default!;
        [Required]
        [MaxLength(15)]
        public string Phone { get; set; } = default!;
        [Required]
        [MaxLength(50)]
        public string Email { get; set; } = default!;
        [Required]
        [MaxLength(150)]
        public string Address { get; set; } = default!;
        public ICollection<BuyOrder> BuyOrders { get; set; } = new List<BuyOrder>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
