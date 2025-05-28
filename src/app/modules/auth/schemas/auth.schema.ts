import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Formato de email inválido')
    .transform((email) => email.toLowerCase().trim()),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nome é obrigatório')
      .min(2, 'Nome deve ter pelo menos 2 caracteres')
      .max(100, 'Nome deve ter no máximo 100 caracteres'),
    email: z
      .string()
      .min(1, 'Email é obrigatório')
      .email('Formato de email inválido')
      .transform((email) => email.toLowerCase().trim()),
    password: z
      .string()
      .min(1, 'Senha é obrigatória')
      .min(6, 'Senha deve ter pelo menos 6 caracteres')
      .max(100, 'Senha deve ter no máximo 100 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
    role: z
      .string()
      .min(1, 'Tipo de usuário é obrigatório')
      .refine((role) => ['USER', 'BARBER', 'ADMIN'].includes(role), {
        message: 'Tipo de usuário inválido',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  });

export const recoverPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Formato de email inválido')
    .transform((email) => email.toLowerCase().trim()),
});

export const verificationCodeSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Formato de email inválido')
    .transform((email) => email.toLowerCase().trim()),
  code: z
    .string()
    .min(1, 'Código é obrigatório')
    .length(6, 'Código deve ter 6 dígitos')
    .regex(/^\d+$/, 'Código deve conter apenas números'),
});

export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email é obrigatório')
      .email('Formato de email inválido')
      .transform((email) => email.toLowerCase().trim()),
    password: z
      .string()
      .min(1, 'Nova senha é obrigatória')
      .min(6, 'Nova senha deve ter pelo menos 6 caracteres')
      .max(100, 'Nova senha deve ter no máximo 100 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type RecoverPasswordFormData = z.infer<typeof recoverPasswordSchema>;
export type VerificationCodeFormData = z.infer<typeof verificationCodeSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
