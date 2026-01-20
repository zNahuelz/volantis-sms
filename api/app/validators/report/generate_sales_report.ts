import vine from '@vinejs/vine';

export const GenerateSalesReportValidator = vine.compile(
  vine.object({
    type: vine.enum(['by_day', 'by_week', 'by_month', 'by_year']),
    date: vine.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  })
);
