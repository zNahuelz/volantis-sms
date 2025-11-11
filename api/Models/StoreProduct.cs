using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class StoreProduct
    {
        public int StoreId { get; set; }
        public Store Store { get; set; } = default!;
        public int ProductId { get; set; }
        public Product Product { get; set; } = default!;
        [Required]
        [Precision(18, 2)]
        public decimal BuyPrice { get; set; }
        [Required]
        [Precision(18, 2)]
        public decimal SellPrice { get; set; }
        [Required]
        [Precision(18, 2)]
        public decimal Igv { get; set; }
        [Required]
        [Precision(18, 2)]
        public decimal Profit { get; set; }
        [Required]
        public int Stock { get; set; }
        [Required]
        public bool Salable { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
