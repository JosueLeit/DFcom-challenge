import { create } from 'zustand';
import productService from '../services/productService';

export const useProductStore = create((set, get) => ({
  // Estado inicial
  products: [],
  loading: false,
  error: null,
  selectedProduct: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  },

  // Actions
  /**
   * Buscar todos os produtos
   */
  fetchProducts: async (params = {}) => {
    set({ loading: true, error: null });
    
    try {
      const result = await productService.getAllProducts(params);
      set({ 
        products: result.products, 
        pagination: result.pagination || get().pagination,
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  /**
   * Buscar produto por ID
   */
  getProductById: async (id) => {
    set({ loading: true, error: null });
    
    try {
      const product = await productService.getProductById(id);
      set({ selectedProduct: product, loading: false });
      return product;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  /**
   * Criar novo produto
   */
  createProduct: async (productData) => {
    set({ loading: true, error: null });
    
    try {
      const newProduct = await productService.createProduct(productData);
      const { products } = get();
      set({ 
        products: [...products, newProduct], 
        loading: false 
      });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  /**
   * Atualizar produto existente
   */
  updateProduct: async (id, updateData) => {
    set({ loading: true, error: null });
    
    try {
      const updatedProduct = await productService.updateProduct(id, updateData);
      const { products } = get();
      const updatedProducts = products.map(product =>
        product._id === id ? updatedProduct : product
      );
      set({ products: updatedProducts, loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  /**
   * Deletar produto
   */
  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    
    try {
      await productService.deleteProduct(id);
      const { products } = get();
      const filteredProducts = products.filter(product => product._id !== id);
      set({ products: filteredProducts, loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  },

  /**
   * Definir produto selecionado
   */
  setSelectedProduct: (product) => {
    set({ selectedProduct: product });
  },

  /**
   * Definir lista de produtos (para testes e casos específicos)
   */
  setProducts: (products) => {
    set({ products });
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
      products: [],
      loading: false,
      error: null,
      selectedProduct: null,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        hasNextPage: false,
        hasPrevPage: false,
        limit: 10
      }
    });
  },

  /**
   * Buscar produtos ordenados por rating (mais bem avaliados primeiro)
   */
  getTopRatedProducts: async (params = {}) => {
    set({ loading: true, error: null });
    
    try {
      const { products, pagination } = await productService.getTopRatedProducts(params);
      set({ 
        products, 
        pagination,
        loading: false 
      });
      return { products, pagination };
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
})); 