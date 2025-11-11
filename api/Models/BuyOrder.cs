using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class BuyOrder
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Pending";
        public int StoreId { get; set; }
        public Store Store { get; set; } = default!;
        public int SupplierId { get; set; }
        public Supplier Supplier { get; set; } = default!;
        public ICollection<BuyOrderDetail> Details { get; set; } = new List<BuyOrderDetail>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
