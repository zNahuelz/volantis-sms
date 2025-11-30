import vine from '@vinejs/vine';

export const CreatePresentationValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(50)
      .unique(async (db, value, field) => {
        const payload = field.parent;
        const existing = await db
          .from('presentations')
          .where('name', value)
          .where('numeric_value', payload.numericValue)
          .first();
        return !existing;
      }),

    description: vine.string().trim().maxLength(100).optional().nullable(),

    numericValue: vine.number(),
  })
);
