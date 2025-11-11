using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    [Index(nameof(Ruc), IsUnique = true)]
    public class Store
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = default!;
        [Required]
        [MaxLength(20)]
        public string Ruc { get; set; } = default!;
        [Required]
        [MaxLength(150)]
        public string Address { get; set; } = default!;
        [Required]
        [MaxLength(15)]
        public string Phone { get; set; } = default!;
        public ICollection<ApplicationUser> Users { get; set; } = new List<ApplicationUser>();
        public ICollection<StoreProduct> StoreProducts { get; set; } = new List<StoreProduct>();
        public ICollection<BuyOrder> BuyOrders { get; set; } = new List<BuyOrder>();
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
