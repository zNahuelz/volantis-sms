import vine from '@vinejs/vine';

export const UpdateSupplierValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(100),

    ruc: vine
      .string()
      .trim()
      .fixedLength(11)
      .regex(/^\d{11}$/)
      .unique(async (db, value, field) => {
        const query = db.from('suppliers').where('ruc', value);
        if (field.meta?.supplierId) {
          query.whereNot('id', field.meta.supplierId);
        }
        const exists = await query.first();
        return !exists;
      }),

    phone: vine
      .string()
      .trim()
      .regex(/^\+?\d{6,15}$/),

    email: vine.string().trim().email().maxLength(50),

    address: vine.string().trim().minLength(1).maxLength(150),
  })
);
