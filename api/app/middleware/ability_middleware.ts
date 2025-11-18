import { Exception } from '@adonisjs/core/exceptions';
import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
import User from '../models/user.js';

type UserWithRole = User & { role?: { abilities?: { name: string }[] } };

export default class AbilityMiddleware {
  async handle(ctx: HttpContext, next: NextFn, abilities: string[]) {
    const { response, auth } = ctx;
    const user = auth.user;

    if (!user) {
      return response.status(401).send({
        message: 'Token expirado o inválido.',
      });
    }

    await user.load((query) => {
      query.load('role', (roleQuery) => {
        roleQuery.preload('abilities');
      });
    });

    const userWithRole = user as unknown as UserWithRole;

    if (!userWithRole.role) {
      throw new Exception(
        'El usuario no cuenta con un rol asignado. Comuniquese con administración.',
        { status: 403 }
      );
    }

    const userAbilities: string[] = userWithRole.role.abilities
      ? userWithRole.role.abilities.map((ability) => ability.key)
      : [];

    const hasRequiredAbility = abilities.some((requiredAbility) =>
      userAbilities.includes(requiredAbility)
    );

    if (!hasRequiredAbility) {
      return response.status(403).send({
        status: 403,
        message:
          'El usuario no cuenta con los permisos requeridos para realizar la acción. Vuelva a intentarlo o comuniquese con administración.',
        required: abilities,
        possessed: userAbilities,
      });
    }

    const output = await next();
    return output;
  }
}
