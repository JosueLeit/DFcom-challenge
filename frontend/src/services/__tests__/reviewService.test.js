import reviewService from '../reviewService';
import api from '../api';

// Mock do módulo api
jest.mock('../api');

describe('ReviewService - TDD', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getReviewsByProduct', () => {
    it('deve retornar avaliações de um produto', async () => {
      const mockReviews = [
        { _id: '1', author: 'João', rating: 5, comment: 'Excelente produto!' },
        { _id: '2', author: 'Maria', rating: 4, comment: 'Muito bom' }
      ];
      
      // O reviewService espera response.data.data
      api.get.mockResolvedValue({ data: { data: mockReviews } });
      
      const result = await reviewService.getReviewsByProduct('product123');
      
      expect(api.get).toHaveBeenCalledWith('/api/products/product123/reviews');
      expect(result).toEqual(mockReviews);
    });
  });

  describe('getReviewById', () => {
    it('deve retornar avaliação específica', async () => {
      const mockReview = { _id: '1', author: 'João', rating: 5, comment: 'Ótimo!' };
      api.get.mockResolvedValue({ data: mockReview });
      
      const result = await reviewService.getReviewById('1');
      
      expect(api.get).toHaveBeenCalledWith('/api/reviews/1');
      expect(result).toEqual(mockReview);
    });
  });

  describe('createReview', () => {
    it('deve criar nova avaliação', async () => {
      const newReview = {
        author: 'Carlos',
        rating: 5,
        comment: 'Produto fantástico!'
      };
      
      const createdReview = { ...newReview, _id: '123' };
      const mockResponse = { data: { data: createdReview } };
      api.post.mockResolvedValue(mockResponse);
      
      const result = await reviewService.createReview('product123', newReview);
      
      expect(api.post).toHaveBeenCalledWith('/api/products/product123/reviews', newReview);
      expect(result).toEqual(createdReview);
    });
  });

  describe('updateReview', () => {
    it('deve atualizar avaliação existente', async () => {
      const updateData = { rating: 4, comment: 'Produto bom, mas pode melhorar' };
      const updatedReview = { _id: '1', ...updateData };
      const mockResponse = { data: updatedReview };
      api.put.mockResolvedValue(mockResponse);
      
      const result = await reviewService.updateReview('1', updateData);
      
      expect(api.put).toHaveBeenCalledWith('/api/reviews/1', updateData);
      expect(result).toEqual(updatedReview);
    });
  });

  describe('deleteReview', () => {
    it('deve deletar avaliação', async () => {
      const mockResponse = { data: { message: 'Review deleted' } };
      api.delete.mockResolvedValue(mockResponse);
      
      const result = await reviewService.deleteReview('1');
      
      expect(api.delete).toHaveBeenCalledWith('/api/reviews/1');
      expect(result).toEqual({ message: 'Review deleted' });
    });
  });
}); 