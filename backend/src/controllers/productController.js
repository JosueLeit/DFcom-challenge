import Product from '../models/Product.js';
import Review from '../models/Review.js';

export const productController = {
  // POST /products - Criar produto
  createProduct: async (req, res) => {
    try {
      const { name, description, price, category } = req.body;

      const product = new Product({
        name,
        description,
        price,
        category
      });

      const savedProduct = await product.save();

      res.status(201).json({
        success: true,
        message: 'Produto criado com sucesso',
        data: savedProduct
      });
    } catch (error) {
      console.error('Erro ao criar produto:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Erro de validação',
          details: Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível criar o produto'
      });
    }
  },

  // GET /products - Listar produtos com paginação
  getAllProducts: async (req, res) => {
    try {
      console.log('🔍 getAllProducts: Buscando produtos...');

      // Parâmetros de paginação
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Parâmetros de filtro
      const { category, search } = req.query;

      // Construir filtro
      const filter = {};
      if (category) {
        filter.category = { $regex: category, $options: 'i' };
      }
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      // Buscar produtos com paginação
      const [products, totalProducts] = await Promise.all([
        Product.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Product.countDocuments(filter)
      ]);

      // Calcular informações de paginação
      const totalPages = Math.ceil(totalProducts / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      console.log(`🔍 Encontrados ${products.length} produtos (página ${page}/${totalPages})`);

      res.json({
        success: true,
        message: 'Produtos listados com sucesso',
        data: products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts,
          hasNextPage,
          hasPrevPage,
          limit
        }
      });

    } catch (error) {
      console.error('❌ Erro no getAllProducts:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  },

  // GET /products/:id - Obter produto por ID
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado',
          message: `Produto com ID ${id} não existe`
        });
      }

      res.json({
        success: true,
        message: 'Produto encontrado',
        data: product
      });
    } catch (error) {
      console.error('Erro ao buscar produto:', error);

      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'ID inválido',
          message: 'O ID fornecido não é válido'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível buscar o produto'
      });
    }
  },

  // PUT /products/:id - Atualizar produto
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const product = await Product.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true
        }
      );

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado',
          message: `Produto com ID ${id} não existe`
        });
      }

      res.json({
        success: true,
        message: 'Produto atualizado com sucesso',
        data: product
      });
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);

      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          error: 'Erro de validação',
          details: Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }

      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'ID inválido',
          message: 'O ID fornecido não é válido'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível atualizar o produto'
      });
    }
  },

  // DELETE /products/:id - Deletar produto
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;

      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado',
          message: `Produto com ID ${id} não existe`
        });
      }

      // Deletar avaliações relacionadas primeiro
      await Review.deleteMany({ productId: id });

      // Deletar o produto
      await Product.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Produto e suas avaliações foram deletados com sucesso',
        data: null
      });
    } catch (error) {
      console.error('Erro ao deletar produto:', error);

      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'ID inválido',
          message: 'O ID fornecido não é válido'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível deletar o produto'
      });
    }
  },

  // GET /products/top-rated - Listar produtos ordenados por rating (mais bem avaliados primeiro)
  getTopRatedProducts: async (req, res) => {
    try {
      console.log('🔍 getTopRatedProducts: Buscando produtos mais bem avaliados...');

      // Parâmetros de paginação
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Parâmetros de filtro
      const { category, search } = req.query;

      // Construir filtro base para produtos
      const productFilter = {};
      if (category) {
        productFilter.category = { $regex: category, $options: 'i' };
      }
      if (search) {
        productFilter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      // Agregação para calcular rating médio e ordenar
      const pipeline = [
        // Filtrar produtos se necessário
        ...(Object.keys(productFilter).length > 0 ? [{ $match: productFilter }] : []),

        // Lookup para buscar reviews
        {
          $lookup: {
            from: 'reviews',
            localField: '_id',
            foreignField: 'productId',
            as: 'reviews'
          }
        },

        // Adicionar campos calculados
        {
          $addFields: {
            averageRating: {
              $cond: {
                if: { $gt: [{ $size: '$reviews' }, 0] },
                then: { $avg: '$reviews.rating' },
                else: 0
              }
            },
            totalReviews: { $size: '$reviews' }
          }
        },

        // Remover o campo reviews para não sobrecarregar a resposta
        {
          $project: {
            reviews: 0
          }
        },

        // Ordenar por rating médio (decrescente), depois por número de reviews (decrescente)
        {
          $sort: {
            averageRating: -1,
            totalReviews: -1,
            createdAt: -1
          }
        },

        // Paginação
        { $skip: skip },
        { $limit: limit }
      ];

      // Executar agregação
      const products = await Product.aggregate(pipeline);

      // Contar total de produtos (para paginação)
      const totalCountPipeline = [
        ...(Object.keys(productFilter).length > 0 ? [{ $match: productFilter }] : []),
        { $count: 'total' }
      ];

      const totalCountResult = await Product.aggregate(totalCountPipeline);
      const totalProducts = totalCountResult.length > 0 ? totalCountResult[0].total : 0;

      // Calcular informações de paginação
      const totalPages = Math.ceil(totalProducts / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      console.log(`🔍 Encontrados ${products.length} produtos ordenados por rating (página ${page}/${totalPages})`);

      res.json({
        success: true,
        message: 'Produtos mais bem avaliados listados com sucesso',
        data: products,
        pagination: {
          currentPage: page,
          totalPages,
          totalProducts,
          hasNextPage,
          hasPrevPage,
          limit
        }
      });

    } catch (error) {
      console.error('❌ Erro no getTopRatedProducts:', error);
      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: error.message
      });
    }
  },

  // GET /products/:id/rating-average - Obter média das avaliações
  getProductRatingAverage: async (req, res) => {
    try {
      const { id } = req.params;

      // Verificar se o produto existe
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado',
          message: `Produto com ID ${id} não existe`
        });
      }

      // Buscar todas as reviews do produto (sem agregação)
      const reviews = await Review.find({ productId: id });

      if (reviews.length === 0) {
        return res.json({
          success: true,
          message: 'Média calculada (sem avaliações)',
          data: {
            productId: id,
            averageRating: 0,
            totalReviews: 0,
            ratingCounts: {
              '1': 0,
              '2': 0,
              '3': 0,
              '4': 0,
              '5': 0
            }
          }
        });
      }

      // Calcular métricas manualmente
      const totalReviews = reviews.length;
      const averageRating = Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews) * 10) / 10;

      const ratingCounts = {
        '1': reviews.filter(r => r.rating === 1).length,
        '2': reviews.filter(r => r.rating === 2).length,
        '3': reviews.filter(r => r.rating === 3).length,
        '4': reviews.filter(r => r.rating === 4).length,
        '5': reviews.filter(r => r.rating === 5).length
      };

      res.json({
        success: true,
        message: 'Média das avaliações calculada com sucesso',
        data: {
          productId: id,
          averageRating,
          totalReviews,
          ratingCounts
        }
      });
    } catch (error) {
      console.error('Erro ao calcular média das avaliações:', error);

      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'ID inválido',
          message: 'O ID fornecido não é válido'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível calcular a média das avaliações'
      });
    }
  }
};

export default productController;
