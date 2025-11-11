using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace api.Models
{
    [Index(nameof(Key), IsUnique = true)]
    public class Ability
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = default!;
        [Required]
        [MaxLength(150)]
        public string Key { get; set; } = default!;
        [MaxLength(150)]
        public string? Description { get; set; }
        public ICollection<RoleAbility> RoleAbilities { get; set; } = new List<RoleAbility>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
