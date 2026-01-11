import vine from '@vinejs/vine';

export const UpdatePaymentTypeValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(20)
      .unique(async (db, value, field) => {
        const query = db.from('payment_types').where('name', value);
        if (field.meta?.paymentTypeId) {
          query.whereNot('id', field.meta.paymentTypeId);
        }
        const exists = await query.first();
        return !exists;
      }),
    action: vine.string().trim().toUpperCase().in(['CASH', 'DIGITAL']),
  })
);
