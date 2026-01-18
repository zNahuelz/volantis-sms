import vine from '@vinejs/vine';

export const VerifyRecoveryTokenValidator = vine.compile(
  vine.object({
    token: vine.string().trim().minLength(100).maxLength(100),
  })
);
