namespace volantis_sms.Models
{
    public class StoreProduct
    {
        public int StoreId { get; set; }
        public Store Store { get; set; } = default!;
        public int ProductId { get; set; }
        public Product Product { get; set; } = default!;
        public decimal BuyPrice { get; set; }
        public decimal SellPrice { get; set; }
        public decimal Igv { get; set; }
        public decimal Profit { get; set; }
        public int Stock { get; set; }
        public bool Salable { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
