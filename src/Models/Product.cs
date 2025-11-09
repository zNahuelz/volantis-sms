namespace volantis_sms.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Barcode { get; set; }
        public string Description { get; set; }
        public int PresentationId { get; set; }
        public Presentation Presentation { get; set; } = default!;
        public ICollection<StoreProduct> StoreProducts { get; set; } = new List<StoreProduct>();
        public ICollection<BuyOrderDetail> BuyOrderDetails { get; set; } = new List<BuyOrderDetail>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
