import vine from '@vinejs/vine';

export const CreateUserValidator = vine.compile(
  vine.object({
    names: vine.string().trim().minLength(3).maxLength(30),

    surnames: vine.string().trim().minLength(3).maxLength(30),

    dni: vine.string().trim().minLength(8).maxLength(15).unique({
      table: 'users',
      column: 'dni',
      caseInsensitive: true,
    }),

    email: vine.string().trim().email().maxLength(50).unique({
      table: 'users',
      column: 'email',
      caseInsensitive: true,
    }),

    profilePicture: vine.string().optional(),

    roleId: vine.number().exists({ table: 'roles', column: 'id' }),

    storeId: vine.number().exists({ table: 'stores', column: 'id' }),
  })
);
