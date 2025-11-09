namespace volantis_sms.Models
{
    public class VoucherType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public ICollection<VoucherSeries> VoucherSeries { get; set; } = new List<VoucherSeries>();
        public ICollection<Sale> Sales { get; set; } = new List<Sale>();
    }
}
