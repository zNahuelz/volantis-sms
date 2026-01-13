import vine from '@vinejs/vine';

export const UpdateStoreValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(100),

    ruc: vine
      .string()
      .trim()
      .fixedLength(11)
      .regex(/^\d{11}$/)
      .unique(async (db, value, field) => {
        const payload = field.parent;
        const meta = field.meta;

        const query = db.from('stores').where('ruc', value).where('name', payload.name);

        if (meta?.storeId) {
          query.whereNot('id', meta.storeId);
        }

        const existing = await query.first();

        return !existing;
      }),

    phone: vine
      .string()
      .trim()
      .regex(/^\+?\d{6,15}$/),

    address: vine.string().trim().minLength(1).maxLength(150),
  })
);
