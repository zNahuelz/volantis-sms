import vine from '@vinejs/vine';

export const CreateSettingValidator = vine.compile(
  vine.object({
    key: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(200)
      .regex(/^[A-Za-z0-9_-]+$/)
      .unique({ table: 'settings', column: '_key', caseInsensitive: true }),

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
