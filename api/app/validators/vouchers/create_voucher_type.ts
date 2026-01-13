import vine from '@vinejs/vine';

export const CreateVoucherTypeValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(50)
      .unique({ table: 'voucher_types', column: 'name', caseInsensitive: true }),
  })
);
