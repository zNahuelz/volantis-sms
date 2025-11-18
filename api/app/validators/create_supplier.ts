import vine from '@vinejs/vine';

export const CreateSupplierValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).maxLength(100),

    ruc: vine
      .string()
      .trim()
      .fixedLength(11)
      .regex(/^\d{11}$/)
      .unique({ table: 'suppliers', column: 'ruc', caseInsensitive: true }),

    phone: vine
      .string()
      .trim()
      .regex(/^\+?\d{6,15}$/),

    email: vine.string().trim().email().maxLength(50),

    address: vine.string().trim().minLength(1).maxLength(150),
  })
);
