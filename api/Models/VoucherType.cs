using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    [Index(nameof(Name), IsUnique = true)]
    public class VoucherType
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = default!;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
        public ICollection<VoucherSeries> VoucherSeries { get; set; } = new List<VoucherSeries>();
        public ICollection<Sale> Sales { get; set; } = new List<Sale>();
    }
}
