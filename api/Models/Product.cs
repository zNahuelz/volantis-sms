using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    [Index(nameof(Barcode), IsUnique = true)]
    public class Product
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = default!;
        [Required]
        [MaxLength(30)]
        public string Barcode { get; set; } = default!;
        [Required]
        [MaxLength(150)]
        public string Description { get; set; } = default!;
        public int PresentationId { get; set; }
        public Presentation Presentation { get; set; } = default!;
        public ICollection<StoreProduct> StoreProducts { get; set; } = new List<StoreProduct>();
        public ICollection<BuyOrderDetail> BuyOrderDetails { get; set; } = new List<BuyOrderDetail>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
