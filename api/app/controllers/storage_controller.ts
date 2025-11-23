import type { HttpContext } from '@adonisjs/core/http';
import fs from 'node:fs/promises';
import path from 'node:path';

const UPLOAD_ROOT = path.resolve('uploads/profile_pictures');

export default class StorageController {
  async show({ params, response }: HttpContext) {
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
}
