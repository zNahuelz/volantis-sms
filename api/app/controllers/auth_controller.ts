import type { HttpContext } from '@adonisjs/core/http';
import User from '../models/user.js';
import { LoginValidator } from '../validators/login.js';
import { UpdateUserEmailValidator } from '../validators/update_user_email.js';
import db from '@adonisjs/lucid/services/db';
import { UpdateUserPasswordValidator } from '../validators/update_user_password.js';

export default class AuthController {
  async login({ request, response, auth }: HttpContext) {
    const { username, password, rememberMe } = await request.validateUsing(LoginValidator);
    const user = await User.verifyCredentials(username, password);

    if (user.deletedAt !== null) {
      return response.unauthorized({
        errors: 'Su cuenta de usuario se encuentra deshabilitada. Comuniquese con administración.',
      });
    }

    await user.load('role', (roleQuery) => {
      roleQuery.preload('abilities');
    });

    await user.load('store');

    const abilities = user.role.abilities.map((a) => a.key);

    const token = await auth
      .use('api')
      .createToken(user, abilities, { expiresIn: rememberMe ? '7 days' : '24 hours' });
    return response.ok({
      token,
      user: {
        id: user.id,
        names: user.names,
        surnames: user.surnames,
        dni: user.dni,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        role: {
          id: user.role.id,
          name: user.role.name,
          abilities: user.role.abilities,
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
    });
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

  public async updateEmail({ auth, request, response }: HttpContext) {
    const user = auth.user;

    if (!user) {
      return response.unauthorized({ message: 'Token expirado o inválido.' });
    }

    try {
      const data = await request.validateUsing(UpdateUserEmailValidator, {
        meta: { userId: user.id },
      });

      await db.transaction(async (trx) => {
        user.useTransaction(trx);
        user.email = data.newEmail.trim().toUpperCase();
        await user.save();
      });

      return response.ok({
        message: 'Correo electrónico actualizado correctamente.',
        email: user.email,
      });
    } catch (error) {
      return response.badRequest({
        message:
          'Error durante la actualización de correo electrónico. Intente nuevamente o comuníquese con administración.',
        errors: error.messages || error.message,
      });
    }
  }

  public async updatePassword({ auth, request, response }: HttpContext) {
    const user = auth.user;

    if (!user) {
      return response.unauthorized({ message: 'Token expirado o inválido.' });
    }

    try {
      const { oldPassword, newPassword } = await request.validateUsing(UpdateUserPasswordValidator);

      const isValidOldPassword = await user.verifyPassword(oldPassword);
      if (!isValidOldPassword) {
        return response.badRequest({
          message: 'La contraseña actual es incorrecta, intente nuevamente.',
        });
      }

      await db.transaction(async (trx) => {
        user.useTransaction(trx);
        user.password = newPassword;
        await user.save();

        const tokens = await User.accessTokens.all(user);
        await Promise.all(
          tokens.map((token) => {
            User.accessTokens.delete(user, token.identifier);
          })
        );
      });

      return response.ok({
        message: 'Contraseña actualizada correctamente.',
      });
    } catch (error) {
      return response.badRequest({
        message:
          'Error durante la actualización de contraseña. Intente nuevamente o comuníquese con administración.',
        errors: error.messages || error.message,
      });
    }
  }

  public async resetPassword({ request, response }: HttpContext) {
    const id = request.param('id');
    const user = await User.find(id);
    if (!user) {
      return response.notFound({
        message: `Usuario de ID: ${id} no encontrado.`,
      });
    }

    try {
      await db.transaction(async (trx) => {
        user.useTransaction(trx);
        if (user.dni != null && user.dni.length >= 5 && user.dni.length <= 15) {
          await user.merge({ password: user.dni.trim() }).save();
        } else {
          await user
            .merge({
              password: `${new Date().getDay().toString()}${(new Date().getMonth() + 1).toString()}${new Date().getFullYear().toString()}`,
            })
            .save();
        }

        const tokens = await User.accessTokens.all(user);
        await Promise.all(
          tokens.map((token) => {
            User.accessTokens.delete(user, token.identifier);
          })
        );
      });

      return response.ok({
        message: 'Contraseña restablecida correctamente.',
      });
    } catch (error) {
      return response.badRequest({
        message:
          'Error durante el restablecimiento de contraseña. Intente nuevamente o comuníquese con administración.',
        errors: error.messages || error.message,
      });
    }
  }

  public async profile({ auth, response }: HttpContext) {
    const user = auth.user;

    if (!user) {
      return response.unauthorized({ message: 'Token expirado o inválido.' });
    }

    await user.load('store');
    await user.load('role', (roleQuery) => {
      roleQuery.preload('abilities');
    });

    const userData = {
      ...user.serialize(),
    };

    return response.ok(userData);
  }
}
