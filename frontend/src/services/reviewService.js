import api from './api';

const reviewService = {
  /**
   * Buscar avaliações de um produto específico
   * @param {string} productId - ID do produto
   */
  async getReviewsByProduct(productId) {
    try {
      const response = await api.get(`/api/products/${productId}/reviews`);
      // Backend retorna { success, data } onde data é o array de reviews
      return response.data.data || [];
    } catch (error) {
      console.error(`Erro ao buscar avaliações do produto ${productId}:`, error);
      throw error;
    }
  },

  /**
   * Buscar avaliação por ID
   * @param {string} id - ID da avaliação
   */
  async getReviewById(id) {
    try {
      const response = await api.get(`/api/reviews/${id}`);
      // Backend retorna { success, data }
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erro ao buscar avaliação ${id}:`, error);
      throw error;
    }
  },

  /**
   * Criar nova avaliação para um produto
   * @param {string} productId - ID do produto
   * @param {Object} reviewData - Dados da avaliação
   */
  async createReview(productId, reviewData) {
    try {
      const response = await api.post(`/api/products/${productId}/reviews`, reviewData);
      // Backend retorna { success, message, data }
      return response.data.data;
    } catch (error) {
      console.error(`Erro ao criar avaliação para produto ${productId}:`, error);
      throw error;
    }
  },

  /**
   * Atualizar avaliação existente
   * @param {string} id - ID da avaliação
   * @param {Object} updateData - Dados para atualização
   */
  async updateReview(id, updateData) {
    try {
      const response = await api.put(`/api/reviews/${id}`, updateData);
      // Backend retorna { success, message, data }
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erro ao atualizar avaliação ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deletar avaliação
   * @param {string} id - ID da avaliação
   */
  async deleteReview(id) {
    try {
      const response = await api.delete(`/api/reviews/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar avaliação ${id}:`, error);
      throw error;
    }
  },

  /**
   * Buscar média das avaliações de um produto
   * @param {string} productId - ID do produto
   */
  async getProductRatingAverage(productId) {
    try {
      const response = await api.get(`/api/products/${productId}/rating`);
      return response.data.data || {
        averageRating: 0,
        totalReviews: 0,
        ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    } catch (error) {
      console.error(`Erro ao buscar média das avaliações do produto ${productId}:`, error);
      throw error;
    }
  }
};

export default reviewService; 