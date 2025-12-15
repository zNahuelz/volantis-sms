import vine from '@vinejs/vine';

export const CreateAbilityValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(150),
    key: vine.string().trim().minLength(3).maxLength(150).unique({
      table: 'abilities',
      column: '_key',
      caseInsensitive: true,
    }),
    description: vine.string().trim().minLength(3).maxLength(150),
  })
);
