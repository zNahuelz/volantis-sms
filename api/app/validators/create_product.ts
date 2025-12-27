import vine from '@vinejs/vine';

export const CreateProductValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(100),
    barcode: vine
      .string()
      .trim()
      .minLength(8)
      .maxLength(30)
      .regex(/^[A-Za-z0-9]{8,30}$/)
      .unique({
        table: 'products',
        column: 'barcode',
        caseInsensitive: true,
      }),

    description: vine.string().trim().minLength(3).maxLength(150),

    presentationId: vine.number().exists({
      table: 'presentations',
      column: 'id',
    }),
  })
);
