import vine from '@vinejs/vine';

export const CreateRoleValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(20).unique({
      table: 'roles',
      column: 'name',
      caseInsensitive: true,
    }),

    abilitiesIds: vine
      .array(
        vine.number().exists({
          table: 'abilities',
          column: 'id',
        })
      )
      .minLength(1)
      .distinct(),
  })
);
