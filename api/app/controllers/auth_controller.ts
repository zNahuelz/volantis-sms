import type { HttpContext } from '@adonisjs/core/http';
import User from '../models/user.js';
import { LoginValidator } from '../validators/login.js';

export default class AuthController {
  async login({ request, response, auth }: HttpContext) {
    const { username, password, rememberMe } = await request.validateUsing(LoginValidator);
    const user = await User.verifyCredentials(username, password);

    await user.load('role', (roleQuery) => {
      roleQuery.preload('abilities');
    });

    await user.load('store');

    const abilities = user.role.abilities.map((a) => a.key);

    const token = await auth
      .use('api')
      .createToken(user, abilities, { expiresIn: rememberMe ? '7 days' : '24 hours' });
    return {
      token,
      user: {
        id: user.id,
        names: user.names,
        surnames: user.surnames,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        role: {
          id: user.role.id,
          name: user.role.name,
        },
        store: user.store
          ? {
              id: user.store.id,
              name: user.store.name,
              ruc: user.store.ruc,
              address: user.store.address,
              phone: user.store.phone,
            }
          : null,
      },
    };
  }

  public async logout({ auth, response }: HttpContext) {
    try {
      await auth.use('api').invalidateToken();

      return response.ok({
        message: 'Sesión cerrada correctamente.',
      });
    } catch (error) {
      return response.unauthorized({
        message: 'No se pudo cerrar la sesión o el token ya expiró.',
      });
    }
  }

  public async profile({ auth, response }: HttpContext) {
    const user = auth.user;

    if (!user) {
      return response.unauthorized({ message: 'Token expirado o inválido.' });
    }

    await user.load('role');

    const userData = {
      ...user.serialize(),
      token: {
        isExpired: auth.user?.currentAccessToken?.isExpired,
        abilities: auth.user?.currentAccessToken?.abilities,
      },
    };

    return response.ok(userData);
  }
}
