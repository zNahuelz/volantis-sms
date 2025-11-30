import vine from '@vinejs/vine';

export const UpdateSettingValidator = vine.compile(
  vine.object({
    key: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(200)
      .regex(/^[A-Za-z0-9_-]+$/)
      .unique(async (db, value, field) => {
        const query = db.from('settings').where('_key', value);
        if (field.meta?.settingId) {
          query.whereNot('id', field.meta.settingId);
        }
        const exists = await query.first();
        return !exists;
      }),

    value: vine.string().minLength(1).maxLength(255),

    valueType: vine.enum(['double', 'string', 'array', 'integer', 'decimal', 'boolean', 'other']),

    description: vine
      .string()
      .trim()
      .maxLength(150)
      .optional()
      .nullable()
      .transform((val) => (val === '' ? '-----' : val)),
  })
);
