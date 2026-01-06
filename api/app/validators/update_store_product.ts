import vine from '@vinejs/vine';

export const UpdateStoreProductValidator = vine.compile(
  vine.object({
    buyPrice: vine.number().min(0.1),
    sellPrice: vine.number().min(0.1),
    igv: vine.number().min(0),
    profit: vine.number().min(0),
    stock: vine.number().min(0),
    salable: vine.boolean(),
  })
);
