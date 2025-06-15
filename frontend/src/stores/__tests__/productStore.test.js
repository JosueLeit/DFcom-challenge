import { renderHook, act } from '@testing-library/react';
import { useProductStore } from '../productStore';
import productService from '../../services/productService';

// Mock do productService
jest.mock('../../services/productService');

describe('ProductStore - TDD', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store state
    useProductStore.getState().resetStore();
  });

  it('deve ter estado inicial correto', () => {
    const { result } = renderHook(() => useProductStore());
    
    expect(result.current.products).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.selectedProduct).toBe(null);
    expect(result.current.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
      totalProducts: 0,
      hasNextPage: false,
      hasPrevPage: false,
      limit: 10
    });
  });

  describe('fetchProducts', () => {
    it('deve buscar produtos com sucesso', async () => {
      const mockProducts = [
        { _id: '1', name: 'Produto 1', price: 100 },
        { _id: '2', name: 'Produto 2', price: 200 }
      ];
      
      const mockPagination = {
        currentPage: 1,
        totalPages: 1,
        totalProducts: 2,
        hasNextPage: false,
        hasPrevPage: false,
        limit: 10
      };
      
      // O productService agora retorna { products, pagination }
      productService.getAllProducts.mockResolvedValue({
        products: mockProducts,
        pagination: mockPagination
      });
      
      const { result } = renderHook(() => useProductStore());
      
      await act(async () => {
        await result.current.fetchProducts();
      });
      
      expect(result.current.products).toEqual(mockProducts);
      expect(result.current.pagination).toEqual(mockPagination);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(productService.getAllProducts).toHaveBeenCalledWith({});
    });

    it('deve buscar produtos com filtros', async () => {
      const mockProducts = [];
      const mockPagination = {
        currentPage: 2,
        totalPages: 1,
        totalProducts: 0,
        hasNextPage: false,
        hasPrevPage: true,
        limit: 10
      };
      
      productService.getAllProducts.mockResolvedValue({
        products: mockProducts,
        pagination: mockPagination
      });
      
      const { result } = renderHook(() => useProductStore());
      
      await act(async () => {
        await result.current.fetchProducts({ category: 'eletrônicos', page: 2 });
      });
      
      expect(productService.getAllProducts).toHaveBeenCalledWith({ 
        category: 'eletrônicos', 
        page: 2 
      });
    });

    it('deve definir loading como true durante busca', async () => {
      productService.getAllProducts.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({
          products: [],
          pagination: {}
        }), 100))
      );
      
      const { result } = renderHook(() => useProductStore());
      
      act(() => {
        result.current.fetchProducts();
      });
      
      expect(result.current.loading).toBe(true);
    });

    it('deve tratar erro na busca', async () => {
      const errorMessage = 'Erro ao buscar produtos';
      productService.getAllProducts.mockRejectedValue(new Error(errorMessage));
      
      const { result } = renderHook(() => useProductStore());
      
      await act(async () => {
        await result.current.fetchProducts();
      });
      
      expect(result.current.products).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  describe('createProduct', () => {
    it('deve criar produto com sucesso', async () => {
      const newProduct = { name: 'Novo Produto', price: 300 };
      const createdProduct = { _id: '3', ...newProduct };
      
      productService.createProduct.mockResolvedValue(createdProduct);
      
      const { result } = renderHook(() => useProductStore());
      
      const success = await act(async () => {
        return await result.current.createProduct(newProduct);
      });
      
      expect(success).toBe(true);
      expect(result.current.products).toContain(createdProduct);
      expect(productService.createProduct).toHaveBeenCalledWith(newProduct);
    });

    it('deve tratar erro na criação', async () => {
      const newProduct = { name: '', price: -1 };
      const errorMessage = 'Dados inválidos';
      
      productService.createProduct.mockRejectedValue(new Error(errorMessage));
      
      const { result } = renderHook(() => useProductStore());
      
      const success = await act(async () => {
        return await result.current.createProduct(newProduct);
      });
      
      expect(success).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  describe('updateProduct', () => {
    it('deve atualizar produto existente', async () => {
      const existingProduct = { _id: '1', name: 'Produto 1', price: 100 };
      const updateData = { name: 'Produto Atualizado', price: 150 };
      const updatedProduct = { ...existingProduct, ...updateData };
      
      productService.updateProduct.mockResolvedValue(updatedProduct);
      
      const { result } = renderHook(() => useProductStore());
      
      // Adicionar produto inicial
      act(() => {
        result.current.setProducts([existingProduct]);
      });
      
      const success = await act(async () => {
        return await result.current.updateProduct('1', updateData);
      });
      
      expect(success).toBe(true);
      expect(result.current.products[0]).toEqual(updatedProduct);
      expect(productService.updateProduct).toHaveBeenCalledWith('1', updateData);
    });
  });

  describe('deleteProduct', () => {
    it('deve deletar produto', async () => {
      const product = { _id: '1', name: 'Produto 1', price: 100 };
      
      productService.deleteProduct.mockResolvedValue({ message: 'Deleted' });
      
      const { result } = renderHook(() => useProductStore());
      
      // Adicionar produto inicial
      act(() => {
        result.current.setProducts([product]);
      });
      
      const success = await act(async () => {
        return await result.current.deleteProduct('1');
      });
      
      expect(success).toBe(true);
      expect(result.current.products).toEqual([]);
      expect(productService.deleteProduct).toHaveBeenCalledWith('1');
    });
  });

  describe('setSelectedProduct', () => {
    it('deve definir produto selecionado', () => {
      const product = { _id: '1', name: 'Produto 1', price: 100 };
      
      const { result } = renderHook(() => useProductStore());
      
      act(() => {
        result.current.setSelectedProduct(product);
      });
      
      expect(result.current.selectedProduct).toEqual(product);
    });

    it('deve limpar produto selecionado', () => {
      const { result } = renderHook(() => useProductStore());
      
      act(() => {
        result.current.setSelectedProduct(null);
      });
      
      expect(result.current.selectedProduct).toBe(null);
    });
  });
}); 