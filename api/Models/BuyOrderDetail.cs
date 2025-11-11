using Microsoft.EntityFrameworkCore;

namespace api.Models
{
    public class BuyOrderDetail
    {
        public int BuyOrderId { get; set; }
        public BuyOrder BuyOrder { get; set; } = default!;
        public int ProductId { get; set; }
        public Product Product { get; set; } = default!;
        public int Quantity { get; set; }
        [Precision(18, 2)]
        public decimal UnitCost { get; set; }
        [Precision(18, 2)]
        public decimal Total => Quantity * UnitCost;
    }
}
