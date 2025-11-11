using Microsoft.AspNetCore.Authorization;

namespace api.Authorization
{
    public class AbilityRequirement : IAuthorizationRequirement
    {
        public string Ability { get; }
        public AbilityRequirement(string ability) => Ability = ability;
    }

    public class AbilityHandler : AuthorizationHandler<AbilityRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AbilityRequirement requirement)
        {
            var hasAbility = context.User.HasClaim(c => c.Type == "Ability" && c.Value == requirement.Ability);
            if (hasAbility)
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}
