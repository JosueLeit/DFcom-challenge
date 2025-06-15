import Review from '../models/Review.js';
import Product from '../models/Product.js';

const reviewController = {
  // POST /products/:productId/reviews - Criar avaliação
  createReview: async (req, res) => {
    try {
      const { productId } = req.params;
      const { author, rating, comment } = req.body;

      // Verificar se o produto existe
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado',
          message: `Produto com ID ${productId} não foi encontrado`
        });
      }

      // Validar dados obrigatórios
      if (!author || !rating || !comment) {
        return res.status(400).json({
          success: false,
          error: 'Dados obrigatórios ausentes',
          message: 'Author, rating e comment são obrigatórios',
          details: [
            !author && { field: 'author', message: 'Nome do autor é obrigatório' },
            !rating && { field: 'rating', message: 'Avaliação é obrigatória' },
            !comment && { field: 'comment', message: 'Comentário é obrigatório' }
          ].filter(Boolean)
        });
      }

      // Validar rating
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          error: 'Rating inválido',
          message: 'Rating deve estar entre 1 e 5',
          details: [{ field: 'rating', message: 'Rating deve estar entre 1 e 5' }]
        });
      }

      // Criar nova avaliação
      const review = new Review({
        productId,
        author: author.trim(),
        rating: parseInt(rating),
        comment: comment.trim()
      });

      const savedReview = await review.save();

      res.status(201).json({
        success: true,
        message: 'Avaliação criada com sucesso',
        data: savedReview
      });
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);

      if (error.name === 'ValidationError') {
        const details = Object.keys(error.errors).map(key => ({
          field: key,
          message: error.errors[key].message
        }));

        return res.status(400).json({
          success: false,
          error: 'Erro de validação',
          message: 'Dados inválidos fornecidos',
          details
        });
      }

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro ao criar avaliação'
      });
    }
  },

  // GET /products/:productId/reviews - Listar avaliações do produto
  getAllReviews: async (req, res) => {
    try {
      const { productId } = req.params;

      // Verificar se o produto existe
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Produto não encontrado',
          message: `Produto com ID ${productId} não existe`
        });
      }

      const reviews = await Review.find({ productId })
        .sort({ createdAt: -1 })
        .populate('product', 'name');

      res.json({
        success: true,
        data: reviews
      });
    } catch (error) {
      console.error('Erro ao listar avaliações:', error);

      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'ID inválido',
          message: 'O ID do produto fornecido não é válido'
        });
      }

      res.status(500).json({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível listar as avaliações'
      });
    }
  },

  // GET /reviews/:id - Obter avaliação por ID
  getReviewById: async (req, res) => {
    try {
      const { id } = req.params;

      const review = await Review.findById(id)
        .populate('product', 'name description');

      if (!review) {
        return res.status(404).json({
          success: false,
          error: 'Avaliação não encontrada',
          message: `Avaliação com ID ${id} não existe`
        });
      }

      res.json({
        success: true,
        data: review
      });
    } catch (error) {
      console.error('Erro ao buscar avaliação:', error);

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
        message: 'Não foi possível buscar a avaliação'
      });
    }
  },

  // PUT /reviews/:id - Atualizar avaliação
  updateReview: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const review = await Review.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true
        }
      );

      if (!review) {
        return res.status(404).json({
          success: false,
          error: 'Avaliação não encontrada',
          message: `Avaliação com ID ${id} não existe`
        });
      }

      res.json({
        success: true,
        message: 'Avaliação atualizada com sucesso',
        data: review
      });
    } catch (error) {
      console.error('Erro ao atualizar avaliação:', error);

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
        message: 'Não foi possível atualizar a avaliação'
      });
    }
  },

  // DELETE /reviews/:id - Deletar avaliação
  deleteReview: async (req, res) => {
    try {
      const { id } = req.params;

      const review = await Review.findByIdAndDelete(id);

      if (!review) {
        return res.status(404).json({
          success: false,
          error: 'Avaliação não encontrada',
          message: `Avaliação com ID ${id} não existe`
        });
      }

      res.json({
        success: true,
        message: 'Avaliação removida com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar avaliação:', error);

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
        message: 'Não foi possível deletar a avaliação'
      });
    }
  }
};

export default reviewController;
