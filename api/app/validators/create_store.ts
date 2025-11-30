import vine from '@vinejs/vine';

export const CreateStoreValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(100),

    ruc: vine
      .string()
      .trim()
      .fixedLength(11)
      .regex(/^\d{11}$/)
      .unique(async (db, value, field) => {
        const payload = field.parent;

        const existing = await db
          .from('stores')
          .where('ruc', value)
          .where('name', payload.name)
          .first();

        return !existing;
      }),

    phone: vine
      .string()
      .trim()
      .regex(/^\+?\d{6,15}$/),

    address: vine.string().trim().minLength(1).maxLength(150),
  })
);
