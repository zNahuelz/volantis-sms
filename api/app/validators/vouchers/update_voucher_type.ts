import vine from '@vinejs/vine';

export const UpdateVoucherTypeValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(50)
      .unique(async (db, value, field) => {
        const query = db.from('voucher_types').where('name', value);
        if (field.meta?.voucherTypeId) {
          query.whereNot('id', field.meta.voucherTypeId);
        }
        const exists = await query.first();
        return !exists;
      }),
  })
);
