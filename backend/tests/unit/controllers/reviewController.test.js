import reviewController from '../../../src/controllers/reviewController.js';
import Review from '../../../src/models/Review.js';
import Product from '../../../src/models/Product.js';
import '../../setup.js';

describe('ReviewController - Testes Unitários (TDD)', () => {
  let mockReq, mockRes, productId;

  beforeEach(async () => {
    // Criar produto de teste
    const product = await Product.create({
      name: 'Produto Teste',
      description: 'Descrição teste',
      price: 100,
      category: 'eletrônicos'
    });
    productId = product._id.toString();

    mockReq = {
      body: {},
      params: {},
      query: {}
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('createReview', () => {
    test('deve criar uma avaliação com dados válidos', async () => {
      const product = await Product.create({
        name: 'Produto Teste',
        description: 'Descrição teste',
        price: 100,
        category: 'eletrônicos'
      });

      const mockReq = {
        params: { productId: product._id.toString() },
        body: {
          author: 'João Silva',
          rating: 5,
          comment: 'Produto excelente! Recomendo muito para todos.'
        }
      };
      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await reviewController.createReview(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      const response = mockRes.json.mock.calls[0][0];
      expect(response.success).toBe(true);
      expect(response.message).toBe('Avaliação criada com sucesso');
      expect(response.data.author).toBe('João Silva');
      expect(response.data.rating).toBe(5);
      expect(response.data.comment).toBe('Produto excelente! Recomendo muito para todos.');
      expect(response.data.productId).toBeDefined();
    });

    it('deve retornar erro 400 com dados inválidos', async () => {
      const invalidData = {
        author: 'A', // muito curto
        rating: 6, // acima do máximo
        comment: 'Curto' // muito curto
      };

      mockReq.params = { productId };
      mockReq.body = invalidData;

      await reviewController.createReview(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Rating inválido',
        message: 'Rating deve estar entre 1 e 5',
        details: [{ field: 'rating', message: 'Rating deve estar entre 1 e 5' }]
      });
    });

    it('deve retornar erro 404 para produto inexistente', async () => {
      const fakeProductId = '507f1f77bcf86cd799439011';

      mockReq.params = { productId: fakeProductId };
      mockReq.body = {
        author: 'João Silva',
        rating: 5,
        comment: 'Comentário válido para teste'
      };

      await reviewController.createReview(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Produto não encontrado',
        message: `Produto com ID ${fakeProductId} não foi encontrado`
      });
    });
  });

  describe('getAllReviews', () => {
    test('deve listar todas as avaliações de um produto', async () => {
      const product = await Product.create({
        name: 'Produto Teste',
        description: 'Descrição teste',
        price: 100,
        category: 'eletrônicos'
      });

      await Review.create([
        {
          productId: product._id,
          author: 'João Silva',
          rating: 5,
          comment: 'Produto excelente!'
        },
        {
          productId: product._id,
          author: 'Maria Santos',
          rating: 4,
          comment: 'Muito bom produto!'
        }
      ]);

      const mockReq = {
        params: { productId: product._id.toString() }
      };
      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await reviewController.getAllReviews(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.arrayContaining([
          expect.objectContaining({
            author: 'João Silva',
            rating: 5
          }),
          expect.objectContaining({
            author: 'Maria Santos',
            rating: 4
          })
        ])
      });
    });

    it('deve retornar erro 404 para produto inexistente', async () => {
      const fakeProductId = '507f1f77bcf86cd799439011';
      mockReq.params = { productId: fakeProductId };

      await reviewController.getAllReviews(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Produto não encontrado',
        message: `Produto com ID ${fakeProductId} não existe`
      });
    });
  });

  describe('getReviewById', () => {
    test('deve retornar avaliação por ID', async () => {
      const product = await Product.create({
        name: 'Produto Teste',
        description: 'Descrição teste',
        price: 100,
        category: 'eletrônicos'
      });

      const review = await Review.create({
        productId: product._id,
        author: 'João Silva',
        rating: 5,
        comment: 'Produto excelente!'
      });

      const mockReq = {
        params: { id: review._id.toString() }
      };
      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await reviewController.getReviewById(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          author: 'João Silva',
          rating: 5,
          comment: 'Produto excelente!'
        })
      });
    });

    it('deve retornar erro 404 para avaliação inexistente', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      mockReq.params = { id: fakeId };

      await reviewController.getReviewById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Avaliação não encontrada',
        message: `Avaliação com ID ${fakeId} não existe`
      });
    });
  });

  describe('updateReview', () => {
    test('deve atualizar avaliação com dados válidos', async () => {
      const product = await Product.create({
        name: 'Produto Teste',
        description: 'Descrição teste',
        price: 100,
        category: 'eletrônicos'
      });

      const review = await Review.create({
        productId: product._id,
        author: 'João Silva',
        rating: 4,
        comment: 'Produto bom!'
      });

      const mockReq = {
        params: { id: review._id.toString() },
        body: {
          rating: 5,
          comment: 'Na verdade, produto excelente!'
        }
      };
      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await reviewController.updateReview(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Avaliação atualizada com sucesso',
        data: expect.objectContaining({
          rating: 5,
          comment: 'Na verdade, produto excelente!'
        })
      });
    });

    it('deve retornar erro 404 para avaliação inexistente', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      mockReq.params = { id: fakeId };
      mockReq.body = { rating: 5 };

      await reviewController.updateReview(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Avaliação não encontrada',
        message: `Avaliação com ID ${fakeId} não existe`
      });
    });
  });

  describe('deleteReview', () => {
    let reviewId;

    beforeEach(async () => {
      const review = await Review.create({
        productId,
        author: 'João Silva',
        rating: 5,
        comment: 'Produto para deletar'
      });
      reviewId = review._id.toString();
    });

    it('deve deletar avaliação existente', async () => {
      mockReq.params = { id: reviewId };

      await reviewController.deleteReview(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Avaliação removida com sucesso'
      });

      // Verificar se foi realmente deletada
      const deletedReview = await Review.findById(reviewId);
      expect(deletedReview).toBeNull();
    });

    it('deve retornar erro 404 para avaliação inexistente', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      mockReq.params = { id: fakeId };

      await reviewController.deleteReview(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Avaliação não encontrada',
        message: `Avaliação com ID ${fakeId} não existe`
      });
    });
  });
});
