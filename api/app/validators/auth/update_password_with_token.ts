import vine from '@vinejs/vine';

export const UpdatePasswordWithTokenValidator = vine.compile(
  vine.object({
    password: vine.string().minLength(5).maxLength(20),
    token: vine.string().trim().minLength(100).maxLength(100),
  })
);
