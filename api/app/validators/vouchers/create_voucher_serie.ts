import vine from '@vinejs/vine';

export const CreateVoucherSerieValidator = vine.compile(
  vine.object({
    seriesCode: vine
      .string()
      .trim()
      .regex(/^[BF](00[1-9]|0[1-9][0-9]|[1-9][0-9]{2})$/)
      .unique({ table: 'voucher_series', column: 'series_code', caseInsensitive: true })
      .unique({ table: 'sales', column: '_set', caseInsensitive: true }),
    currentNumber: vine.number().positive().min(1),
    voucherTypeId: vine.number().exists({ table: 'voucher_types', column: 'id' }),
  })
);
