import vine from '@vinejs/vine';

export const UpdateCustomerValidator = vine.compile(
  vine.object({
    names: vine.string().trim().minLength(3).maxLength(30),

    surnames: vine.string().trim().minLength(3).maxLength(30),

    address: vine.string().trim().maxLength(150).optional().nullable(),

    phone: vine
      .string()
      .trim()
      .regex(/^\+?\d{6,15}$/),

    email: vine.string().trim().email().maxLength(50),

    dni: vine
      .string()
      .trim()
      .minLength(8)
      .maxLength(15)
      .unique(async (db, value, field) => {
        const query = db.from('customers').where('dni', value);
        if (field.meta?.customerId) {
          query.whereNot('id', field.meta.customerId);
        }
        const exists = await query.first();
        return !exists;
      }),
  })
);
