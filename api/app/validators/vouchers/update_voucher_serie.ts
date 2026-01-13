import vine from '@vinejs/vine';

export const UpdateVoucherSerieValidator = vine.compile(
  vine.object({
    currentNumber: vine.number().positive().min(1).max(999999),
  })
);
