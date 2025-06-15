import request from 'supertest';
import express from 'express';
import cors from 'cors';
import productRoutes from '../../src/routes/productRoutes.js';
import Product from '../../src/models/Product.js';
import './setup.js';

// Criar app específico para testes (sem conectar ao DB)
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products', productRoutes);

describe('Product Routes - Testes de Integração', () => {

  describe('POST /api/products', () => {
    it('deve criar um produto com dados válidos', async () => {
      const productData = {
        name: 'iPhone 15 Test',
        description: 'Smartphone para testes',
        price: 999.99,
        category: 'eletrônicos'
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(201);

      expect(response.body).toEqual({
        success: true,
        message: 'Produto criado com sucesso',
        data: expect.objectContaining({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          category: productData.category,
          _id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        })
      });
    });

    it('deve retornar erro 400 para dados inválidos', async () => {
      const invalidData = {
        name: '',
        description: 'Descrição',
        price: -10
      };

      const response = await request(app)
        .post('/api/products')
        .send(invalidData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'Erro de validação',
        details: expect.any(Array)
      });
    });
  });

  describe('GET /api/products', () => {
    beforeEach(async () => {
      await Product.create([
        { name: 'Produto Test 1', description: 'Descrição 1', price: 100, category: 'eletrônicos' },
        { name: 'Produto Test 2', description: 'Descrição 2', price: 200, category: 'roupas' }
      ]);
    });

    test('deve listar todos os produtos', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body).toEqual({
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

      expect(response.body.data).toHaveLength(2);
    });

    test('deve filtrar produtos por categoria', async () => {
      const response = await request(app)
        .get('/api/products?category=eletrônicos')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toMatchObject({
        category: 'eletrônicos'
      });
    });

    test('deve paginar resultados', async () => {
      const response = await request(app)
        .get('/api/products?page=1&limit=1')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination).toMatchObject({
        currentPage: 1,
        totalPages: 2,
        totalProducts: 2,
        hasNextPage: true,
        hasPrevPage: false,
        limit: 1
      });
    });
  });

  describe('GET /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create({
        name: 'Produto Test',
        description: 'Descrição test',
        price: 150,
        category: 'eletrônicos'
      });
      productId = product._id.toString();
    });

    test('deve retornar produto por ID', async () => {
      const response = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Produto encontrado',
        data: expect.objectContaining({
          _id: productId,
          name: 'Produto Test',
          description: 'Descrição test',
          price: 150,
          category: 'eletrônicos'
        })
      });
    });

    it('deve retornar erro 404 para produto inexistente', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .get(`/api/products/${fakeId}`)
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Produto não encontrado',
        message: `Produto com ID ${fakeId} não existe`
      });
    });

    it('deve retornar erro 400 para ID inválido', async () => {
      const response = await request(app)
        .get('/api/products/id_invalido')
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: 'ID inválido',
        message: 'O ID fornecido não é válido'
      });
    });
  });

  describe('PUT /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create({
        name: 'Produto Original',
        description: 'Descrição original',
        price: 100,
        category: 'eletrônicos'
      });
      productId = product._id.toString();
    });

    it('deve atualizar produto existente', async () => {
      const updateData = {
        name: 'Produto Atualizado',
        price: 200
      };

      const response = await request(app)
        .put(`/api/products/${productId}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Produto atualizado com sucesso',
        data: expect.objectContaining({
          _id: productId,
          name: 'Produto Atualizado',
          price: 200
        })
      });
    });

    it('deve retornar erro 404 para produto inexistente', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .put(`/api/products/${fakeId}`)
        .send({ name: 'Novo nome' })
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Produto não encontrado',
        message: `Produto com ID ${fakeId} não existe`
      });
    });
  });

  describe('DELETE /api/products/:id', () => {
    let productId;

    beforeEach(async () => {
      const product = await Product.create({
        name: 'Produto Para Deletar',
        description: 'Será deletado',
        price: 99.99,
        category: 'eletrônicos'
      });
      productId = product._id.toString();
    });

    test('deve deletar produto existente', async () => {
      const response = await request(app)
        .delete(`/api/products/${productId}`)
        .expect(200);

      expect(response.body).toEqual({
        success: true,
        message: 'Produto e suas avaliações foram deletados com sucesso',
        data: null
      });

      // Verificar se foi realmente deletado
      const deletedProduct = await Product.findById(productId);
      expect(deletedProduct).toBeNull();
    });

    it('deve retornar erro 404 para produto inexistente', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .delete(`/api/products/${fakeId}`)
        .expect(404);

      expect(response.body).toEqual({
        success: false,
        error: 'Produto não encontrado',
        message: `Produto com ID ${fakeId} não existe`
      });
    });
  });
});
