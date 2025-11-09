namespace volantis_sms.Models
{
    public class Customer
    {
        public int Id { get; set; }
        public string Names { get; set; }
        public string Surnames { get; set; }
        public string? Address { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public ICollection<Sale> Sales { get; set; } = new List<Sale>();
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }

    }
}
