namespace volantis_sms.Models
{
    public class Presentation
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string? Description { get; set; }
        public decimal NumericValue { get; set; }
        public ICollection<Product> Products { get; set; } = new List<Product>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
