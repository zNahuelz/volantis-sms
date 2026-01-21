import type { HttpContext } from '@adonisjs/core/http';
import User from '../models/user.js';
import { LoginValidator } from '../validators/auth/login.js';
import { UpdateUserEmailValidator } from '../validators/auth/update_user_email.js';
import db from '@adonisjs/lucid/services/db';
import { UpdateUserPasswordValidator } from '../validators/auth/update_user_password.js';
import { AccountRecoveryValidator } from '../validators/auth/account_recovery.js';
import RecoveryToken from '../models/recovery_token.js';
import crypto from 'node:crypto';
import env from '../../start/env.js';
import { DateTime } from 'luxon';
import mail from '@adonisjs/mail/services/main';
import { VerifyRecoveryTokenValidator } from '../validators/auth/verify_recovery_token.js';
import { UpdatePasswordWithTokenValidator } from '../validators/auth/update_password_with_token.js';

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

      const oldEmail = user.email.toUpperCase();

      await db.transaction(async (trx) => {
        user.useTransaction(trx);
        user.email = data.newEmail.trim().toUpperCase();
        await user.save();
      });

      await mail.sendLater((message) => {
        message
          .bcc([oldEmail, user.email])
          .subject('SISTEMA VOLANTIS - CORREO ELECTRÓNICO ACTUALIZADO')
          .htmlView('emails/email_updated', {
            date: DateTime.utc().setLocale('es').toFormat('dd LLL yyyy'),
            time: DateTime.utc().setZone('America/Lima').toFormat('hh:mm:ss a'),
            user,
            oldEmail: oldEmail,
          });
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

      await mail.sendLater((message) => {
        message
          .to(user.email)
          .subject('SISTEMA VOLANTIS - CONTRASEÑA ACTUALIZADA')
          .htmlView('emails/password_updated', {
            date: DateTime.utc().setZone('America/Lima').setLocale('es').toFormat('dd LLL yyyy'),
            time: DateTime.utc().setZone('America/Lima').toFormat('hh:mm:ss a'),
            user,
          });
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
      let newPassword = '';
      await db.transaction(async (trx) => {
        user.useTransaction(trx);
        if (user.dni != null && user.dni.length >= 5 && user.dni.length <= 15) {
          newPassword = user.dni.trim();
          await user.merge({ password: newPassword }).save();
        } else {
          newPassword = `${new Date().getDay().toString()}${(new Date().getMonth() + 1).toString()}${new Date().getFullYear().toString()}`;
          await user
            .merge({
              password: newPassword,
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

      await mail.sendLater((message) => {
        message
          .to(user.email)
          .subject('SISTEMA VOLANTIS - CONTRASEÑA RESTABLECIDA')
          .htmlView('emails/password_reset', {
            date: DateTime.utc().setLocale('es').toFormat('dd LLL yyyy'),
            time: DateTime.utc().setZone('America/Lima').toFormat('hh:mm:ss a'),
            username: user.username,
            password: newPassword,
          });
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

  public async sendRecoveryEmail({ request, response }: HttpContext) {
    const data = await request.validateUsing(AccountRecoveryValidator);

    const user = await User.findBy('email', data.email);
    if (!user) {
      return response.ok({
        message:
          'Operación completada correctamente. Si el e-mail ingresado pertenece a un usuario las instrucciones para recuperar su cuenta seran enviadas.',
      });
    }

    try {
      await db.transaction(async (trx) => {
        await RecoveryToken.query({ client: trx })
          .where('email', data.email.toUpperCase())
          .delete();
        const rawToken = crypto.randomBytes(75).toString('base64url');
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
        const recoveryLink = `${env.get('REACT_FRONTEND_URL', 'http://localhost:3000')}/recover-account?token=${rawToken}`;
        await RecoveryToken.create(
          {
            email: data.email.toUpperCase(),
            token: tokenHash,
            expiration: DateTime.utc().plus({ minutes: 5 }),
          },
          { client: trx }
        );

        await mail.sendLater((message) => {
          message
            .to(data.email)
            .subject('SISTEMA VOLANTIS - RECUPERACIÓN DE CUENTA')
            .htmlView('emails/recover_account', { recoveryLink, user });
        });
      });
    } catch (error) {
      return response.internalServerError({
        message: 'Error! Operación cancelada, intente nuevamente o comuniquese con administración.',
      });
    }

    return response.ok({
      message:
        'Operación completada correctamente. Si el e-mail ingresado pertenece a un usuario las instrucciones para recuperar su cuenta seran enviadas.',
    });
  }

  public async verifyRecoveryToken({ request, response }: HttpContext) {
    const data = await request.validateUsing(VerifyRecoveryTokenValidator);

    const tokenHash = crypto.createHash('sha256').update(data.token).digest('hex');

    const dbToken = await RecoveryToken.findBy('token', tokenHash);

    if (!dbToken) {
      return response.notFound({
        message:
          'El token de recuperación es inválido o ha expirado, vuelva a intentarlo. Si el problema persiste comuniquese con administración.',
      });
    }

    if (dbToken.expiration < DateTime.utc()) {
      return response.notFound({
        message:
          'El token de recuperación es inválido o ha expirado, vuelva a intentarlo. Si el problema persiste comuniquese con administración.',
      });
    }

    return response.ok({
      message: 'Token válido.',
    });
  }

  public async updatePasswordWithToken({ request, response }: HttpContext) {
    const data = await request.validateUsing(UpdatePasswordWithTokenValidator);
    const tokenHash = crypto.createHash('sha256').update(data.token).digest('hex');

    const dbToken = await RecoveryToken.findBy('token', tokenHash);

    if (!dbToken) {
      return response.notFound({
        message: 'Error! Token inválido o expirado.',
      });
    }

    if (dbToken.expiration < DateTime.utc()) {
      return response.notFound({
        message: 'Error! Token expirado o invalido.',
      });
    }

    const user = await User.findBy('email', dbToken.email);
    if (!user) {
      return response.notFound({
        message: 'Error! Usuario no encontrado.',
      });
    }

    try {
      await db.transaction(async (trx) => {
        user.useTransaction(trx);
        dbToken.useTransaction(trx);
        await user.merge({ password: data.password }).save();
        await dbToken.delete();
        const tokens = await User.accessTokens.all(user);
        await Promise.all(tokens.map((token) => User.accessTokens.delete(user, token.identifier)));
      });
    } catch (error) {
      return response.internalServerError({
        message:
          'Error interno del servidor, operación cancelada. Intente nuevamente o comuniquese con administración.',
      });
    }

    return response.ok({
      message: 'Contraseña actualizada correctamente. Inicie sesión con sus nuevas credenciales.',
    });
  }
}
