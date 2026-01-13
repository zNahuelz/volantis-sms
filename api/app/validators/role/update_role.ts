import vine from '@vinejs/vine';

export const UpdateRoleValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(20)
      .unique(async (db, value, field) => {
        const query = db.from('roles').where('name', value);
        if (field.meta?.roleId) {
          query.whereNot('id', field.meta.roleId);
        }
        const exists = await query.first();
        return !exists;
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
