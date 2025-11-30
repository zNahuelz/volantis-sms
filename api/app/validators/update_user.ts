import vine from '@vinejs/vine';

export const UpdateUserValidator = vine.compile(
  vine.object({
    names: vine.string().trim().minLength(3).maxLength(30),

    surnames: vine.string().trim().minLength(3).maxLength(30),

    dni: vine
      .string()
      .trim()
      .minLength(8)
      .maxLength(15)
      .unique(async (db, value, field) => {
        const query = db.from('users').where('dni', value);
        if (field.meta?.userId) {
          query.whereNot('id', field.meta.userId);
        }
        const exists = await query.first();
        return !exists;
      }),

    email: vine
      .string()
      .trim()
      .email()
      .maxLength(50)
      .unique(async (db, value, field) => {
        const query = db.from('users').where('email', value);
        if (field.meta?.userId) {
          query.whereNot('id', field.meta.userId);
        }
        const exists = await query.first();
        return !exists;
      }),

    roleId: vine.number().exists({ table: 'roles', column: 'id' }),

    storeId: vine.number().exists({ table: 'stores', column: 'id' }),
  })
);
