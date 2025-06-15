import productController from '../../../src/controllers/productController.js';
import Product from '../../../src/models/Product.js';
import '../../setup.js';

describe('ProductController - Testes Unitários', () => {
  let mockReq, mockRes;

  beforeEach(() => {
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

  describe('createProduct', () => {
    it('deve criar um produto com dados válidos', async () => {
      const productData = {
        name: 'Teste Produto',
        description: 'Descrição do produto teste',
        price: 99.99,
        category: 'eletrônicos'
      };

      mockReq.body = productData;

      await productController.createProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Produto criado com sucesso',
        data: expect.objectContaining({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          category: productData.category
        })
      });
    });

    it('deve retornar erro 400 com dados inválidos', async () => {
      const invalidData = {
        name: '', // nome vazio
        description: 'Descrição',
        price: -10, // preço negativo
        category: 'categoria_invalida' // categoria não existe
      };

      mockReq.body = invalidData;

      await productController.createProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Erro de validação',
        details: expect.any(Array)
      });
    });

    it('deve retornar erro 500 em caso de erro interno', async () => {
      // Mock para simular erro interno
      jest.spyOn(Product.prototype, 'save').mockImplementationOnce(() => {
        throw new Error('Erro interno');
      });

      mockReq.body = {
        name: 'Produto',
        description: 'Descrição',
        price: 99.99,
        category: 'eletrônicos'
      };

      await productController.createProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Não foi possível criar o produto'
      });
    });
  });

  describe('getAllProducts', () => {
    test('deve listar todos os produtos com paginação', async () => {
      // Criar produtos de teste
      await Product.create([
        { name: 'Produto 1', description: 'Descrição 1', price: 100, category: 'eletrônicos' },
        { name: 'Produto 2', description: 'Descrição 2', price: 200, category: 'roupas' }
      ]);

      const mockReq = { query: {} };
      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await productController.getAllProducts(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Produtos listados com sucesso',
        data: expect.any(Array),
        pagination: expect.objectContaining({
          currentPage: 1,
          totalPages: expect.any(Number),
          totalProducts: 2,
          hasNextPage: false,
          hasPrevPage: false,
          limit: 10
        })
      });
    });

    test('deve filtrar produtos por categoria', async () => {
      // Criar produtos de teste
      await Product.create([
        { name: 'Produto 1', description: 'Descrição 1', price: 100, category: 'eletrônicos' },
        { name: 'Produto 2', description: 'Descrição 2', price: 200, category: 'roupas' }
      ]);

      const mockReq = { query: { category: 'eletrônicos' } };
      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await productController.getAllProducts(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Produtos listados com sucesso',
        data: expect.arrayContaining([
          expect.objectContaining({
            category: 'eletrônicos'
          })
        ]),
        pagination: expect.objectContaining({
          totalProducts: 1
        })
      });
    });

    test('deve buscar produtos por texto', async () => {
      // Criar produtos de teste
      await Product.create([
        { name: 'Produto 1', description: 'Descrição 1', price: 100, category: 'eletrônicos' },
        { name: 'Produto 2', description: 'Descrição 2', price: 200, category: 'roupas' }
      ]);

      const mockReq = { query: { search: 'Produto 1' } };
      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await productController.getAllProducts(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Produtos listados com sucesso',
        data: expect.any(Array),
        pagination: expect.objectContaining({
          totalProducts: 1
        })
      });
    });

    it('deve retornar erro 500 em caso de erro interno', async () => {
      // Mock para simular erro interno
      jest.spyOn(Product, 'find').mockImplementationOnce(() => {
        throw new Error('Erro interno');
      });

      mockReq.query = { page: 1, limit: 10 };

      await productController.getAllProducts(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Erro interno do servidor',
        message: 'Erro interno'
      });
    });
  });

  describe('getProductById', () => {
    test('deve retornar produto por ID válido', async () => {
      const product = await Product.create({
        name: 'Produto Teste',
        description: 'Descrição teste',
        price: 50,
        category: 'eletrônicos'
      });

      const mockReq = { params: { id: product._id.toString() } };
      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await productController.getProductById(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Produto encontrado',
        data: expect.objectContaining({
          name: 'Produto Teste',
          description: 'Descrição teste',
          price: 50,
          category: 'eletrônicos'
        })
      });
    });

    it('deve retornar erro 404 para produto inexistente', async () => {
      mockReq.params = { id: '507f1f77bcf86cd799439011' }; // ID válido mas inexistente

      await productController.getProductById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Produto não encontrado',
        message: 'Produto com ID 507f1f77bcf86cd799439011 não existe'
      });
    });

    it('deve retornar erro 400 para ID inválido', async () => {
      mockReq.params = { id: 'id_invalido' };

      await productController.getProductById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'ID inválido',
        message: 'O ID fornecido não é válido'
      });
    });
  });

  describe('updateProduct', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create({
        name: 'Produto Original',
        description: 'Descrição original',
        price: 100.00,
        category: 'eletrônicos'
      });
      productId = product._id.toString();
    });

    it('deve atualizar produto com dados válidos', async () => {
      const updateData = {
        name: 'Produto Atualizado',
        price: 150.00
      };

      mockReq.params = { id: productId };
      mockReq.body = updateData;

      await productController.updateProduct(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Produto atualizado com sucesso',
        data: expect.objectContaining({
          name: 'Produto Atualizado',
          price: 150.00
        })
      });
    });

    it('deve retornar erro 404 para produto inexistente', async () => {
      mockReq.params = { id: '507f1f77bcf86cd799439011' };
      mockReq.body = { name: 'Novo nome' };

      await productController.updateProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Produto não encontrado',
        message: 'Produto com ID 507f1f77bcf86cd799439011 não existe'
      });
    });
  });

  describe('deleteProduct', () => {
    test('deve deletar produto existente', async () => {
      const product = await Product.create({
        name: 'Produto Teste',
        description: 'Descrição teste',
        price: 50,
        category: 'eletrônicos'
      });

      const mockReq = { params: { id: product._id.toString() } };
      const mockRes = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      await productController.deleteProduct(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Produto e suas avaliações foram deletados com sucesso',
        data: null
      });
    });

    it('deve retornar erro 404 para produto inexistente', async () => {
      mockReq.params = { id: '507f1f77bcf86cd799439011' };

      await productController.deleteProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Produto não encontrado',
        message: 'Produto com ID 507f1f77bcf86cd799439011 não existe'
      });
    });
  });
});
