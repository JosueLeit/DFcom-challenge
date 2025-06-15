import { create } from 'zustand';
import reviewService from '../services/reviewService';
import productService from '../services/productService';

export const useReviewStore = create((set, get) => ({
  // Estado inicial
  reviews: [],
  loading: false,
  error: null,
  selectedReview: null,

  // Actions
  /**
   * Buscar avaliações de um produto específico
   */
  getReviewsByProduct: async (productId) => {
    set({ loading: true, error: null });
    
    try {
      const reviews = await reviewService.getReviewsByProduct(productId);
      set({ reviews, loading: false });
      return reviews;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  /**
   * Buscar avaliação por ID
   */
  getReviewById: async (id) => {
    set({ loading: true, error: null });
    
    try {
      const review = await reviewService.getReviewById(id);
      set({ selectedReview: review, loading: false });
      return review;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  /**
   * Criar nova avaliação
   */
  createReview: async (productId, reviewData) => {
    set({ loading: true, error: null });
    
    try {
      const newReview = await reviewService.createReview(productId, reviewData);
      const { reviews } = get();
      set({ 
        reviews: [newReview, ...reviews], 
        loading: false 
      });
      return newReview;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  /**
   * Atualizar avaliação existente
   */
  updateReview: async (id, updateData) => {
    set({ loading: true, error: null });
    
    try {
      const updatedReview = await reviewService.updateReview(id, updateData);
      const { reviews } = get();
      const updatedReviews = reviews.map(review =>
        review._id === id ? updatedReview : review
      );
      set({ reviews: updatedReviews, loading: false });
      return updatedReview;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  /**
   * Deletar avaliação
   */
  deleteReview: async (id) => {
    set({ loading: true, error: null });
    
    try {
      await reviewService.deleteReview(id);
      const { reviews } = get();
      const filteredReviews = reviews.filter(review => review._id !== id);
      set({ reviews: filteredReviews, loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  /**
   * Buscar média das avaliações de um produto
   */
  getProductRatingAverage: async (productId) => {
    try {
      const ratingData = await productService.getProductRatingAverage(productId);
      return ratingData;
    } catch (error) {
      console.error('Erro ao buscar média das avaliações:', error);
      throw error;
    }
  },

  /**
   * Definir avaliação selecionada
   */
  setSelectedReview: (review) => {
    set({ selectedReview: review });
  },

  /**
   * Definir lista de avaliações (para casos específicos)
   */
  setReviews: (reviews) => {
    set({ reviews });
  },

  /**
   * Limpar erro
   */
  clearError: () => {
    set({ error: null });
  },

  /**
   * Reset completo do store (para testes)
   */
  resetStore: () => {
    set({
      reviews: [],
      loading: false,
      error: null,
      selectedReview: null
    });
  }
})); 