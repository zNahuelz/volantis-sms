import vine from '@vinejs/vine';

export const UpdateProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(100),
    barcode: vine
      .string()
      .trim()
      .minLength(8)
      .maxLength(30)
      .regex(/^[A-Za-z0-9]{8,30}$/)
      .unique(async (db, value, field) => {
        const query = db.from('products').where('barcode', value);
        if (field.meta?.productId) {
          query.whereNot('id', field.meta.productId);
        }
        const exists = await query.first();
        return !exists;
      }),

    description: vine.string().trim().minLength(3).maxLength(150),

    presentationId: vine.number().exists({
      table: 'presentations',
      column: 'id',
    }),
  })
);
