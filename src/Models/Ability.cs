namespace volantis_sms.Models
{
    public class Ability
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Key { get; set; }
        public string? Description { get; set; }
        public ICollection<RoleAbility> RoleAbilities { get; set; } = new List<RoleAbility>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }
        public DateTime? DeletedAt { get; set; }
    }
}
