import { z } from 'zod';

// Schema para criação de avaliação
export const createReviewSchema = z.object({
  author: z
    .string({
      required_error: 'Nome do autor é obrigatório',
      invalid_type_error: 'Nome do autor deve ser uma string'
    })
    .min(2, 'Nome do autor deve ter pelo menos 2 caracteres')
    .max(100, 'Nome do autor deve ter no máximo 100 caracteres')
    .trim(),

  rating: z
    .number({
      required_error: 'Avaliação é obrigatória',
      invalid_type_error: 'Avaliação deve ser um número'
    })
    .int('Avaliação deve ser um número inteiro')
    .min(1, 'Avaliação deve ser entre 1 e 5')
    .max(5, 'Avaliação deve ser entre 1 e 5'),

  comment: z
    .string({
      required_error: 'Comentário é obrigatório',
      invalid_type_error: 'Comentário deve ser uma string'
    })
    .min(10, 'Comentário deve ter pelo menos 10 caracteres')
    .max(500, 'Comentário deve ter no máximo 500 caracteres')
    .trim()
});

// Schema para atualização de avaliação (todos os campos opcionais)
export const updateReviewSchema = z.object({
  author: z
    .string({
      invalid_type_error: 'Nome do autor deve ser uma string'
    })
    .min(2, 'Nome do autor deve ter pelo menos 2 caracteres')
    .max(100, 'Nome do autor deve ter no máximo 100 caracteres')
    .trim()
    .optional(),

  rating: z
    .number({
      invalid_type_error: 'Avaliação deve ser um número'
    })
    .int('Avaliação deve ser um número inteiro')
    .min(1, 'Avaliação deve ser entre 1 e 5')
    .max(5, 'Avaliação deve ser entre 1 e 5')
    .optional(),

  comment: z
    .string({
      invalid_type_error: 'Comentário deve ser uma string'
    })
    .min(10, 'Comentário deve ter pelo menos 10 caracteres')
    .max(500, 'Comentário deve ter no máximo 500 caracteres')
    .trim()
    .optional()
});

// Schema para validação de ID de avaliação
export const reviewIdSchema = z.object({
  id: z
    .string({
      required_error: 'ID da avaliação é obrigatório',
      invalid_type_error: 'ID deve ser uma string'
    })
    .regex(/^[0-9a-fA-F]{24}$/, 'ID deve ser um ObjectId válido')
});

// Schema para validação de ID de produto nas rotas de review
export const productIdSchema = z.object({
  productId: z
    .string({
      required_error: 'ID do produto é obrigatório',
      invalid_type_error: 'ID do produto deve ser uma string'
    })
    .regex(/^[0-9a-fA-F]{24}$/, 'ID do produto deve ser um ObjectId válido')
});

// Schema para query parameters de listagem de reviews
export const reviewQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, 'Página deve ser um número')
    .transform(Number)
    .refine((value) => value > 0, 'Página deve ser maior que 0')
    .optional()
    .default('1'),

  limit: z
    .string()
    .regex(/^\d+$/, 'Limite deve ser um número')
    .transform(Number)
    .refine((value) => value > 0 && value <= 50, 'Limite deve ser entre 1 e 50')
    .optional()
    .default('10'),

  rating: z
    .string()
    .regex(/^[1-5]$/, 'Rating deve ser um número entre 1 e 5')
    .transform(Number)
    .optional(),

  author: z
    .string()
    .min(1, 'Nome do autor deve ter pelo menos 1 caractere')
    .max(100, 'Nome do autor deve ter no máximo 100 caracteres')
    .trim()
    .optional(),

  sortBy: z
    .enum(['rating', 'createdAt', 'author'])
    .optional()
    .default('createdAt'),

  sortOrder: z
    .enum(['asc', 'desc'])
    .optional()
    .default('desc')
});

// Schema combinado para rotas que precisam de productId e criação de review
export const createReviewWithProductSchema = z.object({
  params: productIdSchema,
  body: createReviewSchema
});

// Schema combinado para rotas que precisam de productId e query params
export const getReviewsWithProductSchema = z.object({
  params: productIdSchema,
  query: reviewQuerySchema
});
