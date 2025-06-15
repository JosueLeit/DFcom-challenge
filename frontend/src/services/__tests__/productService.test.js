import productService from '../productService';
import api from '../api';

// Mock do módulo api
jest.mock('../api');

describe('ProductService - TDD', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('deve retornar lista de produtos', async () => {
      const mockProducts = [
        { _id: '1', name: 'Produto 1', price: 100, category: 'eletrônicos' },
        { _id: '2', name: 'Produto 2', price: 200, category: 'roupas' }
      ];
      
      const mockPagination = {
        currentPage: 1,
        totalPages: 1,
        totalProducts: 2,
        hasNextPage: false,
        hasPrevPage: false
      };
      
      // Nova estrutura de resposta da API
      api.get.mockResolvedValue({ 
        data: { 
          success: true,
          data: mockProducts,
          pagination: mockPagination
        } 
      });
      
      const result = await productService.getAllProducts();
      
      expect(api.get).toHaveBeenCalledWith('/api/products');
      expect(result).toEqual({
        products: mockProducts,
        pagination: mockPagination
      });
    });

    it('deve passar parâmetros de paginação', async () => {
      const mockResponse = { 
        data: { 
          success: true,
          data: [],
          pagination: {}
        } 
      };
      api.get.mockResolvedValue(mockResponse);
      
      await productService.getAllProducts({ page: 2, limit: 5 });
      
      expect(api.get).toHaveBeenCalledWith('/api/products?page=2&limit=5');
    });

    it('deve passar filtros de categoria', async () => {
      const mockResponse = { 
        data: { 
          success: true,
          data: [],
          pagination: {}
        } 
      };
      api.get.mockResolvedValue(mockResponse);
      
      await productService.getAllProducts({ category: 'eletrônicos' });
      
      expect(api.get).toHaveBeenCalledWith('/api/products?category=eletr%C3%B4nicos');
    });
  });

  describe('getProductById', () => {
    it('deve retornar produto específico', async () => {
      const mockProduct = { _id: '1', name: 'Produto 1', price: 100 };
      api.get.mockResolvedValue({ 
        data: { 
          success: true,
          data: mockProduct
        } 
      });
      
      const result = await productService.getProductById('1');
      
      expect(api.get).toHaveBeenCalledWith('/api/products/1');
      expect(result).toEqual(mockProduct);
    });

    it('deve lançar erro para ID inválido', async () => {
      api.get.mockRejectedValue(new Error('Product not found'));
      
      await expect(productService.getProductById('invalid-id'))
        .rejects.toThrow('Product not found');
    });
  });

  describe('createProduct', () => {
    it('deve criar novo produto', async () => {
      const newProduct = {
        name: 'Novo Produto',
        description: 'Descrição do produto',
        price: 299.99,
        category: 'eletrônicos'
      };
      
      const createdProduct = { ...newProduct, _id: '123' };
      const mockResponse = { 
        data: { 
          success: true,
          data: createdProduct
        } 
      };
      api.post.mockResolvedValue(mockResponse);
      
      const result = await productService.createProduct(newProduct);
      
      expect(api.post).toHaveBeenCalledWith('/api/products', newProduct);
      expect(result).toEqual(createdProduct);
    });

    it('deve lançar erro para dados inválidos', async () => {
      const invalidProduct = { name: '' }; // Nome vazio
      api.post.mockRejectedValue(new Error('Validation error'));
      
      await expect(productService.createProduct(invalidProduct))
        .rejects.toThrow('Validation error');
    });
  });

  describe('updateProduct', () => {
    it('deve atualizar produto existente', async () => {
      const updateData = { name: 'Produto Atualizado', price: 199.99 };
      const updatedProduct = { _id: '1', ...updateData };
      const mockResponse = { 
        data: { 
          success: true,
          data: updatedProduct
        } 
      };
      api.put.mockResolvedValue(mockResponse);
      
      const result = await productService.updateProduct('1', updateData);
      
      expect(api.put).toHaveBeenCalledWith('/api/products/1', updateData);
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('deleteProduct', () => {
    it('deve deletar produto', async () => {
      const mockResponse = { 
        data: { 
          success: true,
          message: 'Product deleted'
        } 
      };
      api.delete.mockResolvedValue(mockResponse);
      
      const result = await productService.deleteProduct('1');
      
      expect(api.delete).toHaveBeenCalledWith('/api/products/1');
      expect(result).toEqual({ 
        success: true,
        message: 'Product deleted'
      });
    });
  });

  describe('getProductRatingAverage', () => {
    it('deve retornar média de avaliações do produto', async () => {
      const mockRating = { averageRating: 4.5, totalReviews: 10 };
      api.get.mockResolvedValue({ 
        data: { 
          success: true,
          data: mockRating
        } 
      });
      
      const result = await productService.getProductRatingAverage('1');
      
      expect(api.get).toHaveBeenCalledWith('/api/products/1/rating-average');
      expect(result).toEqual(mockRating);
    });
  });
}); 