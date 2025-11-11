using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class Sale
    {
        public int Id { get; set; }
        [Required]
        [Precision(18, 2)]
        public decimal Change { get; set; }
        [Required]
        [Precision(18, 2)]
        public decimal CashReceived { get; set; }
        [Required]
        [Precision(18, 2)]
        public decimal Igv { get; set; }
        [Required]
        [Precision(18, 2)]
        public decimal Subtotal { get; set; }
        [Required]
        [Precision(18, 2)]
        public decimal Total { get; set; }
        [Required]
        [MaxLength(50)]
        public string Set { get; set; } = default!;
        [Required]
        [MaxLength(50)]
        public string Correlative { get; set; } = default!;
        public string? PaymentHash { get; set; }
        public int StoreId { get; set; }
        public Store Store { get; set; } = default!;
        public string UserId { get; set; } = default!;
        public ApplicationUser User { get; set; } = default!;
        public int CustomerId { get; set; }
        public Customer Customer { get; set; } = default!;
        public int VoucherTypeId { get; set; }
        public VoucherType VoucherType { get; set; } = default!;
        public int VoucherSeriesId { get; set; }
        public VoucherSeries VoucherSeries { get; set; } = default!;
        public int PaymentTypeId { get; set; }
        public PaymentType PaymentType { get; set; } = default!;
        public ICollection<SaleDetail> Details { get; set; } = new List<SaleDetail>();
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
