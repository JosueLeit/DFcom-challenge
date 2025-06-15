// Script de inicialização do MongoDB para DFcom
print('🚀 Iniciando configuração do banco dfcom_products...');

// Usar o banco dfcom_products
db = db.getSiblingDB('dfcom_products');

// Criar usuário para aplicação
db.createUser({
  user: 'dfcom_user',
  pwd: 'dfcom_password',
  roles: [
    {
      role: 'readWrite',
      db: 'dfcom_products'
    }
  ]
});

// Criar coleções com validação
db.createCollection('products', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'description', 'price', 'category'],
      properties: {
        name: {
          bsonType: 'string',
          description: 'Nome do produto é obrigatório'
        },
        description: {
          bsonType: 'string',
          description: 'Descrição do produto é obrigatória'
        },
        price: {
          bsonType: 'number',
          minimum: 0,
          description: 'Preço deve ser um número positivo'
        },
        category: {
          bsonType: 'string',
          enum: ['eletrônicos', 'roupas', 'casa', 'esportes', 'livros', 'saúde', 'beleza', 'brinquedos', 'alimentação', 'outros'],
          description: 'Categoria deve ser uma das opções válidas'
        }
      }
    }
  }
});

db.createCollection('reviews', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['productId', 'author', 'rating', 'comment'],
      properties: {
        productId: {
          bsonType: 'objectId',
          description: 'ID do produto é obrigatório'
        },
        author: {
          bsonType: 'string',
          description: 'Autor da avaliação é obrigatório'
        },
        rating: {
          bsonType: 'int',
          minimum: 1,
          maximum: 5,
          description: 'Avaliação deve ser entre 1 e 5'
        },
        comment: {
          bsonType: 'string',
          description: 'Comentário é obrigatório'
        }
      }
    }
  }
});

// Criar índices para performance
db.products.createIndex({ name: 'text', description: 'text' });
db.products.createIndex({ category: 1 });
db.products.createIndex({ createdAt: -1 });

db.reviews.createIndex({ productId: 1, createdAt: -1 });
db.reviews.createIndex({ rating: 1 });
db.reviews.createIndex({ productId: 1, rating: -1 });

// Inserir dados de exemplo
print('📦 Inserindo produtos de exemplo...');

const sampleProducts = [
  {
    name: 'iPhone 15 Pro',
    description: 'Smartphone Apple com câmera avançada e chip A17 Pro',
    price: 7999.99,
    category: 'eletrônicos',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Camiseta Nike Dri-FIT',
    description: 'Camiseta esportiva com tecnologia de absorção de suor',
    price: 89.90,
    category: 'roupas',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Mesa de Escritório',
    description: 'Mesa de madeira para escritório home office',
    price: 299.99,
    category: 'casa',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const insertedProducts = db.products.insertMany(sampleProducts);
print(`✅ ${insertedProducts.insertedIds.length} produtos inseridos`);

// Inserir avaliações de exemplo
print('⭐ Inserindo avaliações de exemplo...');

const productIds = Object.values(insertedProducts.insertedIds);

const sampleReviews = [
  {
    productId: productIds[0],
    author: 'João Silva',
    rating: 5,
    comment: 'Excelente smartphone! Câmera incrível e performance excepcional.',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    productId: productIds[0],
    author: 'Maria Santos',
    rating: 4,
    comment: 'Muito bom, mas o preço é um pouco salgado.',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    productId: productIds[1],
    author: 'Pedro Costa',
    rating: 5,
    comment: 'Camiseta de ótima qualidade, muito confortável para exercícios.',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    productId: productIds[2],
    author: 'Ana Lima',
    rating: 4,
    comment: 'Mesa bonita e funcional, montagem um pouco trabalhosa.',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const insertedReviews = db.reviews.insertMany(sampleReviews);
print(`✅ ${insertedReviews.insertedIds.length} avaliações inseridas`);

print('🎉 Configuração do MongoDB concluída com sucesso!');
print('');
print('👤 Usuário criado: dfcom_user');
print('🔑 Senha: dfcom_password');
print('📊 Base de dados: dfcom_products');
print(`📦 Produtos de exemplo: ${productIds.length}`);
print(`⭐ Avaliações de exemplo: ${insertedReviews.insertedIds.length}`);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 1000 },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, enum: ['eletrônicos', 'roupas', 'casa', 'esportes', 'livros', 'saúde', 'beleza', 'brinquedos', 'alimentação', 'outros'] }
});

// Virtual para reviews relacionadas
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'productId'
});

const reviewSchema = new mongoose.Schema({
  productId: { type: ObjectId, ref: 'Product', required: true },
  author: { type: String, required: true, maxlength: 100 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, maxlength: 500 }
}); 