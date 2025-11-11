using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    public class Customer
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(30)]
        public string Names { get; set; } = default!;
        [Required]
        [MaxLength(30)]
        public string Surnames { get; set; } = default!;
        [Required]
        [MaxLength(15)]
        public string Dni { get; set; } = default!;
        [MaxLength(150)]
        public string? Address { get; set; } = default!;
        [Required]
        [MaxLength(15)]
        public string Phone { get; set; } = default!;
        [Required]
        [MaxLength(50)]
        public string Email { get; set; } = default!;
        public ICollection<Sale> Sales { get; set; } = new List<Sale>();
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }

    }
}
