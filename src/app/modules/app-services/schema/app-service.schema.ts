import { z } from 'zod';

/**
 * Schema de validação para atividade.
 */
export const activitySchema = z.object({
  name: z.string().min(3, 'Nome da atividade deve ter pelo menos 3 caracteres'),
  point: z.number().min(1, 'Pontos devem ser maior que 0'),
  active: z.boolean().default(true),
});

/**
 * Schema de validação para categoria.
 */
export const categorySchema = z.object({
  name: z.string().min(3, 'Nome da categoria deve ter pelo menos 3 caracteres'),
  active: z.boolean().default(true),
});

/**
 * Schema de validação para criação de app service.
 */
export const createAppServiceSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  price: z.number().min(0, 'Preço deve ser maior ou igual a 0').optional(),
  duration: z.number().min(1, 'Duração deve ser maior que 0').optional(),
  active: z.boolean().default(true),
  activities: z.array(activitySchema).default([]),
  categories: z.array(categorySchema).default([]),
});

/**
 * Schema de validação para atualização de app service.
 */
export const updateAppServiceSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').optional(),
  description: z.string().optional(),
  price: z.number().min(0, 'Preço deve ser maior ou igual a 0').optional(),
  duration: z.number().min(1, 'Duração deve ser maior que 0').optional(),
  active: z.boolean().optional(),
  activities: z.array(activitySchema).optional(),
  categories: z.array(categorySchema).optional(),
});

/**
 * Schema de validação para atualização de categoria.
 */
export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(3, 'Nome da categoria deve ter pelo menos 3 caracteres')
    .optional(),
  active: z.boolean().optional(),
});

export type CreateAppServiceForm = z.infer<typeof createAppServiceSchema>;
export type UpdateAppServiceForm = z.infer<typeof updateAppServiceSchema>;
export type ActivityForm = z.infer<typeof activitySchema>;
export type CategoryForm = z.infer<typeof categorySchema>;
export type UpdateCategoryForm = z.infer<typeof updateCategorySchema>;
