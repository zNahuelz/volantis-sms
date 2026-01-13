import vine from '@vinejs/vine';

export const UpdateBuyOrderValidator = vine.compile(
  vine.object({
    status: vine
      .string()
      .trim()
      .toUpperCase()
      .in(['PENDIENTE', 'ENVIADO', 'CANCELADA', 'FINALIZADA']),
    subtotal: vine.number().positive(),
    igv: vine.number().positive(),
    total: vine.number().positive(),
    supplierId: vine.number().exists({ table: 'suppliers', column: 'id' }),
    storeId: vine.number().exists({ table: 'stores', column: 'id' }),
    buyOrderDetails: vine
      .array(
        vine.object({
          productId: vine.number().exists({ table: 'products', column: 'id' }),
          quantity: vine.number().positive().min(1),
          unitCost: vine.number().positive().min(0.5),
        })
      )
      .minLength(1)
      .distinct('productId'),
  })
);
