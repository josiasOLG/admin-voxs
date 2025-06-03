import { z } from 'zod';
import { UserRoles } from '../../../shared/enums';

/**
 * Schema de validação para criação de usuário.
 */
export const createUserSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  role: z.nativeEnum(UserRoles, { message: 'Role inválido' }),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

/**
 * Schema de validação para atualização de usuário.
 */
export const updateUserSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').optional(),
  email: z.string().email('Email inválido').optional(),
  phone: z
    .string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .optional(),
  role: z.nativeEnum(UserRoles, { message: 'Role inválido' }).optional(),
  isActive: z.boolean().optional(),
});

/**
 * Schema de validação para endereço do usuário.
 */
export const userAddressSchema = z.object({
  street: z.string().min(3, 'Rua deve ter pelo menos 3 caracteres'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(3, 'Bairro deve ter pelo menos 3 caracteres'),
  city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
});

export type CreateUserForm = z.infer<typeof createUserSchema>;
export type UpdateUserForm = z.infer<typeof updateUserSchema>;
export type UserAddressForm = z.infer<typeof userAddressSchema>;
