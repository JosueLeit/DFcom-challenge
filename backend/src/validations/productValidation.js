import { z } from 'zod';

// Enum para categorias válidas
const CATEGORIES = [
  'eletrônicos',
  'roupas',
  'casa',
  'esportes',
  'livros',
  'saúde',
  'beleza',
  'brinquedos',
  'alimentação',
  'outros'
];

// Schema para criação de produto
export const createProductSchema = z.object({
  name: z
    .string({
      required_error: 'Nome do produto é obrigatório',
      invalid_type_error: 'Nome deve ser uma string'
    })
    .min(1, 'Nome não pode estar vazio')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim(),

  description: z
    .string({
      required_error: 'Descrição do produto é obrigatória',
      invalid_type_error: 'Descrição deve ser uma string'
    })
    .min(1, 'Descrição não pode estar vazia')
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .trim(),

  price: z
    .number({
      required_error: 'Preço do produto é obrigatório',
      invalid_type_error: 'Preço deve ser um número'
    })
    .min(0, 'Preço deve ser maior ou igual a zero')
    .refine(
      (value) => {
        // Validar se tem no máximo 2 casas decimais
        const decimals = (value.toString().split('.')[1] || '').length;
        return decimals <= 2;
      },
      { message: 'Preço deve ter no máximo 2 casas decimais' }
    ),

  category: z
    .enum(CATEGORIES, {
      required_error: 'Categoria do produto é obrigatória',
      invalid_type_error: 'Categoria deve ser uma das opções válidas'
    })
});

// Schema para atualização de produto (todos os campos opcionais)
export const updateProductSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'Nome deve ser uma string'
    })
    .min(1, 'Nome não pode estar vazio')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .trim()
    .optional(),

  description: z
    .string({
      invalid_type_error: 'Descrição deve ser uma string'
    })
    .min(1, 'Descrição não pode estar vazia')
    .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
    .trim()
    .optional(),

  price: z
    .number({
      invalid_type_error: 'Preço deve ser um número'
    })
    .min(0, 'Preço deve ser maior ou igual a zero')
    .refine(
      (value) => {
        if (value === undefined) {
          return true;
        }
        const decimals = (value.toString().split('.')[1] || '').length;
        return decimals <= 2;
      },
      { message: 'Preço deve ter no máximo 2 casas decimais' }
    )
    .optional(),

  category: z
    .enum(CATEGORIES, {
      invalid_type_error: 'Categoria deve ser uma das opções válidas'
    })
    .optional()
});

// Schema para validação de ID de produto
export const productIdSchema = z.object({
  id: z
    .string({
      required_error: 'ID do produto é obrigatório',
      invalid_type_error: 'ID deve ser uma string'
    })
    .regex(/^[0-9a-fA-F]{24}$/, 'ID deve ser um ObjectId válido')
});

// Schema para query parameters de listagem
export const productQuerySchema = z.object({
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
    .refine((value) => value > 0 && value <= 100, 'Limite deve ser entre 1 e 100')
    .optional()
    .default('10'),

  category: z
    .enum(CATEGORIES)
    .optional(),

  search: z
    .string()
    .min(1, 'Termo de busca deve ter pelo menos 1 caractere')
    .max(100, 'Termo de busca deve ter no máximo 100 caracteres')
    .trim()
    .optional(),

  sortBy: z
    .enum(['name', 'price', 'createdAt', 'category'])
    .optional()
    .default('createdAt'),

  sortOrder: z
    .enum(['asc', 'desc'])
    .optional()
    .default('desc')
});

// Exportar categorias para uso em outros módulos
export { CATEGORIES };
