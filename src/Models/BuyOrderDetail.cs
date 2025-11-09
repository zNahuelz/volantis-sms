namespace volantis_sms.Models
{
    public class BuyOrderDetail
    {
        public int BuyOrderId { get; set; }
        public BuyOrder BuyOrder { get; set; } = default!;
        public int ProductId { get; set; }
        public Product Product { get; set; } = default!;
        public int Quantity { get; set; }
        public decimal UnitCost { get; set; }
        public decimal Total => Quantity * UnitCost;
    }
}
