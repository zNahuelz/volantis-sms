namespace volantis_sms.Models
{
    public class Supplier
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Ruc { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public ICollection<BuyOrder> BuyOrders { get; set; } = new List<BuyOrder>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
