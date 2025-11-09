namespace volantis_sms.Models
{
    public class VoucherSeries
    {
        public int Id { get; set; }
        public string SeriesCode { get; set; }
        public int CurrentNumber { get; set; }
        public bool IsActive { get; set; }

        public int VoucherTypeId { get; set; }
        public VoucherType VoucherType { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
