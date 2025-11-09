namespace volantis_sms.Models
{
    public class RoleAbility
    {
        public string RoleId { get; set; } = default!;
        public ApplicationRole Role { get; set; } = default!;

        public int AbilityId { get; set; }
        public Ability Ability { get; set; } = default!;
    }
}
