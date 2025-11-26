import vine from '@vinejs/vine';

export const UpdateUserEmailValidator = vine.compile(
  vine.object({
    newEmail: vine
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
  })
);
