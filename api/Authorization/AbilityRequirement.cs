using Microsoft.AspNetCore.Authorization;

namespace api.Authorization
{
    public class AbilityRequirement : IAuthorizationRequirement
    {
        public string[] Abilities { get; }

        public AbilityRequirement(params string[] abilities)
        {
            Abilities = abilities;
        }
    }

    public class AbilityHandler : AuthorizationHandler<AbilityRequirement>
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            AbilityRequirement requirement)
        {
            var userAbilities = context.User
                .Claims
                .Where(c => c.Type == "Ability")
                .Select(c => c.Value);

            if (requirement.Abilities.Any(req => userAbilities.Contains(req)))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
