import vine from '@vinejs/vine';

export const CreateSaleValidator = vine.compile(
  vine.object({
    change: vine.number().positive().min(0),
    cashReceived: vine.number().positive().min(0),
    igv: vine.number().positive().min(0),
    subtotal: vine.number().positive().min(0),
    total: vine.number().positive().min(0),
    paymentHash: vine.string().nullable(),
    storeId: vine.number().positive().exists({ table: 'stores', column: 'id' }),
    customerId: vine.number().positive().exists({ table: 'customers', column: 'id' }),
    voucherTypeId: vine.number().positive().exists({ table: 'voucher_types', column: 'id' }),
    paymentTypeId: vine.number().positive().exists({ table: 'payment_types', column: 'id' }),
    userId: vine.number().positive().exists({ table: 'users', column: 'id' }),
    cartItems: vine
      .array(
        vine.object({
          productId: vine.number().positive().exists({ table: 'products', column: 'id' }),
          quantity: vine.number().positive(),
          unitPrice: vine.number().positive(),
        })
      )
      .minLength(1)
      .distinct('productId'),
  })
);
