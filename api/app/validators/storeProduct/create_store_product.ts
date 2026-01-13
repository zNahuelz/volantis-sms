import vine from '@vinejs/vine';

export const CreateStoreProductValidator = vine.compile(
  vine.object({
    storeId: vine.number().exists({ table: 'stores', column: 'id' }),
    productId: vine.number().exists({ table: 'products', column: 'id' }),
    buyPrice: vine.number().min(0.1),
    sellPrice: vine.number().min(0.1),
    igv: vine.number().min(0),
    profit: vine.number().min(0),
    stock: vine.number().min(0),
    salable: vine.boolean(),
  })
);
