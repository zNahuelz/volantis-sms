namespace volantis_sms.Models
{
    public class SaleDetail
    {
        public int SaleId { get; set; }
        public Sale Sale { get; set; } = default!;

        public int ProductId { get; set; }
        public Product Product { get; set; } = default!;

        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Subtotal => Quantity * UnitPrice;
    }
}
