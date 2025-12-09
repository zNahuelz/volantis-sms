import type { HttpContext } from '@adonisjs/core/http';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import User from '../models/user.js';

const UPLOAD_ROOT = path.resolve('uploads/profile_pictures');

export default class StorageController {
  async showProfilePicture({ params, response }: HttpContext) {
    const fileName = params.file;

    if (!/^[a-zA-Z0-9._-]+$/.test(fileName)) {
      return response.badRequest({ error: 'Nombre de archivo inválido.' });
    }

    if (!/\.(png|jpg|jpeg|webp)$/i.test(fileName)) {
      return response.badRequest({ error: 'Tipo de extensión inválida.' });
    }

    const safePath = path.resolve(UPLOAD_ROOT, fileName);

    if (!safePath.startsWith(UPLOAD_ROOT)) {
      return response.badRequest({ error: 'Ruta inválida.' });
    }

    try {
      await fs.access(safePath, fs.constants.R_OK);
    } catch {
      return response.notFound({ error: 'Avatar no encontrado.' });
    }

    return response.download(safePath);
  }

  public async updateProfilePicture({ request, auth, response }: HttpContext) {
    const user = auth.user;
    if (!user) return response.unauthorized();

    const file = request.file('picture', {
      size: '5mb',
      extnames: ['jpg', 'jpeg', 'png', 'webp'],
    });

    if (!file) {
      return response.badRequest({ error: 'Error en la subida del archivo.' });
    }

    if (!file.isValid) {
      return response.badRequest(file.errors);
    }

    const randomName = crypto.randomBytes(32).toString('hex');
    const newFilename = `${randomName}.${file.extname}`;

    const finalPath = path.join(UPLOAD_ROOT, newFilename);

    await fs.mkdir(UPLOAD_ROOT, { recursive: true });

    await fs.writeFile(finalPath, await fs.readFile(file.tmpPath!));

    await fs.rm(file.tmpPath!, { force: true });

    if (user.profilePicture) {
      const oldPath = path.join(UPLOAD_ROOT, user.profilePicture);
      await fs.rm(oldPath, { force: true });
    }

    user.profilePicture = newFilename;
    await user.save();

    return response.ok({
      message: 'Foto de perfil actualizada correctamente.',
      url: `/storage/profile/${newFilename}`,
      file: newFilename,
    });
  }

  public async removeProfilePicture({ request, response }: HttpContext) {
    const id = request.param('id');
    const user = await User.find(id);
    if (!user) {
      return response.notFound({
        message: `Usuario de ID: ${id} no encontrado.`,
      });
    }

    if (user.profilePicture) {
      const oldPath = path.join(UPLOAD_ROOT, user.profilePicture);
      await fs.rm(oldPath, { force: true });
    }
    if (user.profilePicture != null) {
      await user.merge({ profilePicture: null }).save();
    }
    return response.ok({
      message: `Foto de perfil del usuario de ID: ${id} restablecida correctamente.`,
    });
  }
}
