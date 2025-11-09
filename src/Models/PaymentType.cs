namespace volantis_sms.Models
{
    public class PaymentType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public ICollection<Sale> Sales { get; set; } = new List<Sale>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
