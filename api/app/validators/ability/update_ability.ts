import vine from '@vinejs/vine';

export const UpdateAbilityValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(150),
    key: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(150)
      .unique(async (db, value, field) => {
        const query = db.from('abilities').where('_key', value);
        if (field.meta?.abilityId) {
          query.whereNot('id', field.meta.abilityId);
        }
        const exists = await query.first();
        return !exists;
      }),
    description: vine.string().trim().minLength(3).maxLength(150),
  })
);
