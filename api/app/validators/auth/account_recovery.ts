import vine from '@vinejs/vine';

export const AccountRecoveryValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email().maxLength(50),
  })
);
