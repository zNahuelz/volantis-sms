using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    [Index(nameof(SeriesCode), IsUnique = true)]
    public class VoucherSeries
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string SeriesCode { get; set; } = default!;
        [Required]
        public int CurrentNumber { get; set; }
        [Required]
        public bool IsActive { get; set; } = false;
        public int VoucherTypeId { get; set; }
        public VoucherType VoucherType { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
