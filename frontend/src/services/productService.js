import api from './api';

const productService = {
  /**
   * Buscar todos os produtos
   * @param {Object} params - Parâmetros de busca (page, limit, category, search)
   */
  async getAllProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Adicionar parâmetros de paginação
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Adicionar parâmetros de filtro
      if (params.category) queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);

      const url = `/api/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      
      return {
        products: response.data.data,
        pagination: response.data.pagination
      };
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw error;
    }
  },

  /**
   * Buscar produto por ID
   * @param {string} id - ID do produto
   */
  async getProductById(id) {
    try {
      const response = await api.get(`/api/products/${id}`);
      return response.data.data; // Acessando os dados em data.data
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Criar novo produto
   * @param {Object} productData - Dados do produto
   */
  async createProduct(productData) {
    try {
      const response = await api.post('/api/products', productData);
      return response.data.data; // Acessando os dados em data.data
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw error;
    }
  },

  /**
   * Atualizar produto existente
   * @param {string} id - ID do produto
   * @param {Object} updateData - Dados para atualização
   */
  async updateProduct(id, updateData) {
    try {
      const response = await api.put(`/api/products/${id}`, updateData);
      return response.data.data; // Acessando os dados em data.data
    } catch (error) {
      console.error(`Erro ao atualizar produto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Deletar produto
   * @param {string} id - ID do produto
   */
  async deleteProduct(id) {
    try {
      const response = await api.delete(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar produto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Buscar média de avaliações do produto
   * @param {string} id - ID do produto
   */
  async getProductRatingAverage(id) {
    try {
      const response = await api.get(`/api/products/${id}/rating-average`);
      return response.data.data; // Acessando os dados em data.data
    } catch (error) {
      console.error(`Erro ao buscar média de avaliações do produto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Buscar produtos ordenados por rating (mais bem avaliados primeiro)
   * @param {Object} params - Parâmetros de busca (page, limit, category, search)
   */
  async getTopRatedProducts(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Adicionar parâmetros de paginação
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Adicionar parâmetros de filtro
      if (params.category) queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);

      const url = `/api/products/top-rated${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      
      return {
        products: response.data.data,
        pagination: response.data.pagination
      };
    } catch (error) {
      console.error('Erro ao buscar produtos mais bem avaliados:', error);
      throw error;
    }
  }
};

export default productService; 