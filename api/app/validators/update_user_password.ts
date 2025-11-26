import vine from '@vinejs/vine';

export const UpdateUserPasswordValidator = vine.compile(
  vine.object({
    oldPassword: vine.string().minLength(5).maxLength(20),
    newPassword: vine.string().minLength(5).maxLength(20),
  })
);
