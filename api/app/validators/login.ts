import vine from '@vinejs/vine';

export const LoginValidator = vine.compile(
  vine.object({
    username: vine.string().minLength(5).maxLength(20),
    password: vine.string().minLength(5).maxLength(20),
    rememberMe: vine.boolean(),
  })
);
