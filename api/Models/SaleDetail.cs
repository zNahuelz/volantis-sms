using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class SaleDetail
    {
        public int SaleId { get; set; }
        public Sale Sale { get; set; } = default!;
        public int ProductId { get; set; }
        public Product Product { get; set; } = default!;
        [Required]
        public int Quantity { get; set; }
        [Required]
        [Precision(18, 2)]
        public decimal UnitPrice { get; set; }
        [Required]
        [Precision(18, 2)]
        public decimal Subtotal => Quantity * UnitPrice;
    }
}
