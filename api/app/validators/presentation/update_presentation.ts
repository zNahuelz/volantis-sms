import vine from '@vinejs/vine';

export const UpdatePresentationValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(50)
      .unique(async (db, value, field) => {
        const payload = field.parent;
        const meta = field.meta;

        const query = db
          .from('presentations')
          .where('name', value)
          .where('numeric_value', payload.numericValue);

        if (meta?.presentationId) {
          query.whereNot('id', meta.presentationId);
        }

        const existing = await query.first();
        return !existing;
      }),

    description: vine.string().trim().maxLength(100).optional().nullable(),

    numericValue: vine.number(),
  })
);
