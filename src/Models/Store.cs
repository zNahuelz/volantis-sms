namespace volantis_sms.Models
{
    public class Store
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string RUC { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public ICollection<ApplicationUser> Users { get; set; } = new List<ApplicationUser>();
        public ICollection<StoreProduct> StoreProducts { get; set; } = new List<StoreProduct>();
        public ICollection<BuyOrder> BuyOrders { get; set; } = new List<BuyOrder>();
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
