import vine from '@vinejs/vine';

export const CreateCustomerValidator = vine.compile(
  vine.object({
    names: vine.string().trim().minLength(3).maxLength(30),

    surnames: vine.string().trim().minLength(3).maxLength(30),

    address: vine.string().trim().maxLength(150).optional().nullable(),

    phone: vine
      .string()
      .trim()
      .regex(/^\+?\d{6,15}$/),

    email: vine.string().trim().email().maxLength(50),

    dni: vine.string().trim().minLength(8).maxLength(15).unique({
      table: 'customers',
      column: 'dni',
      caseInsensitive: true,
    }),
  })
);
