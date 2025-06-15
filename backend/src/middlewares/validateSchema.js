import { ZodError } from 'zod';

/**
 * Middleware genérico para validação com Zod
 * @param {Object} schemas - Objeto com schemas para validar (body, params, query)
 * @returns {Function} Middleware do Express
 */
export const validateSchema = (schemas) => {
  return async (req, res, next) => {
    try {
      // Validar body se fornecido
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }

      // Validar params se fornecido
      if (schemas.params) {
        req.params = await schemas.params.parseAsync(req.params);
      }

      // Validar query se fornecido
      if (schemas.query) {
        req.query = await schemas.query.parseAsync(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
          received: err.received
        }));

        return res.status(400).json({
          error: 'Erro de validação',
          message: 'Os dados fornecidos são inválidos',
          details: validationErrors
        });
      }

      // Se não for erro de validação, passar para o próximo middleware
      next(error);
    }
  };
};

/**
 * Middleware específico para validar apenas o body
 * @param {ZodSchema} schema - Schema Zod para validação
 * @returns {Function} Middleware do Express
 */
export const validateBody = (schema) => {
  return validateSchema({ body: schema });
};

/**
 * Middleware específico para validar apenas os params
 * @param {ZodSchema} schema - Schema Zod para validação
 * @returns {Function} Middleware do Express
 */
export const validateParams = (schema) => {
  return validateSchema({ params: schema });
};

/**
 * Middleware específico para validar apenas a query
 * @param {ZodSchema} schema - Schema Zod para validação
 * @returns {Function} Middleware do Express
 */
export const validateQuery = (schema) => {
  return validateSchema({ query: schema });
};

/**
 * Middleware para validar ObjectId
 * Útil para rotas que precisam validar IDs do MongoDB
 */
export const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];

    if (!id) {
      return res.status(400).json({
        error: 'ID obrigatório',
        message: `O parâmetro ${paramName} é obrigatório`
      });
    }

    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!objectIdRegex.test(id)) {
      return res.status(400).json({
        error: 'ID inválido',
        message: `O ${paramName} deve ser um ObjectId válido`
      });
    }

    next();
  };
};

/**
 * Middleware para tratar erros de validação customizados
 * Útil quando precisamos de validações mais específicas
 */
export const handleValidationError = (error, req, res, next) => {
  if (error.name === 'ValidationError') {
    const validationErrors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message,
      value: err.value
    }));

    return res.status(400).json({
      error: 'Erro de validação do MongoDB',
      message: 'Os dados fornecidos não atendem aos critérios de validação',
      details: validationErrors
    });
  }

  next(error);
};
