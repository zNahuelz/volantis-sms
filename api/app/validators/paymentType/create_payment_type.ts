import vine from '@vinejs/vine';

export const CreatePaymentTypeValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(20)
      .unique({ table: 'payment_types', column: 'name', caseInsensitive: true }),
    action: vine.string().trim().toUpperCase().in(['CASH', 'DIGITAL']),
  })
);
