import mongoose from 'mongoose';
import Product from './models/Product.js';
import Review from './models/Review.js';
import { config } from 'dotenv';

config();

// Dados de exemplo
const sampleProducts = [
  {
    name: 'Smartphone Samsung Galaxy S24',
    description: 'Celular Android com 256GB de armazenamento, câmera tripla de 50MP com IA e tela Dynamic AMOLED de 6.2 polegadas. Design premium com acabamento em vidro e alumínio. Processador Snapdragon 8 Gen 3 para máxima performance.',
    price: 2499.99,
    category: 'eletrônicos'
  },
  {
    name: 'Notebook Dell Inspiron 15 3000',
    description: 'Laptop ideal para trabalho e estudos com processador Intel Core i7 11ª geração, 16GB de RAM DDR4, SSD de 512GB NVMe e placa de vídeo Intel Iris Xe. Tela Full HD de 15.6 polegadas antirreflexo.',
    price: 3299.90,
    category: 'eletrônicos'
  },
  {
    name: 'Tênis Nike Air Max 270',
    description: 'Tênis esportivo unissex com tecnologia Air Max no calcanhar para máximo conforto. Cabedal em mesh respirável e solado em borracha antiderrapante. Ideal para corridas e uso casual.',
    price: 549.99,
    category: 'esportes'
  },
  {
    name: 'Cadeira Gamer ThunderX3 EC3',
    description: 'Cadeira gamer ergonômica com apoio lombar ajustável, braços 4D e inclinação até 180°. Revestimento em couro sintético de alta qualidade com costuras reforçadas. Suporta até 150kg.',
    price: 899.99,
    category: 'casa'
  },
  {
    name: 'Fone Bluetooth Sony WH-1000XM5',
    description: 'Fone de ouvido over-ear com cancelamento de ruído líder da indústria. Bateria de até 30 horas, carregamento rápido e qualidade de áudio High-Resolution. Ideal para trabalho e viagens.',
    price: 1699.99,
    category: 'eletrônicos'
  },
  {
    name: 'Livro "Clean Code" - Robert Martin',
    description: 'Guia essencial para desenvolvedores sobre como escrever código limpo e eficiente. Técnicas, princípios e práticas para melhorar a qualidade do software. Inclui exemplos práticos e casos reais.',
    price: 89.90,
    category: 'livros'
  },
  {
    name: 'Monitor LG UltraWide 29" 4K',
    description: 'Monitor ultrawide de 29 polegadas com resolução 4K UHD, tecnologia IPS para cores precisas e HDR10 para melhor contraste. Ideal para produtividade e entertainment. Conexões USB-C e HDMI.',
    price: 1999.99,
    category: 'eletrônicos'
  },
  {
    name: 'Camiseta Adidas Originals',
    description: 'Camiseta casual da linha Originals com logo clássico bordado. Tecido 100% algodão premium, corte regular e disponível em várias cores. Peça atemporal para o guarda-roupa.',
    price: 129.99,
    category: 'roupas'
  },
  {
    name: 'Panela de Pressão Elétrica Mondial',
    description: 'Panela de pressão elétrica de 5 litros com 12 funções pré-programadas. Timer digital, válvula de segurança e cuba antiaderente. Ideal para preparar refeições completas rapidamente.',
    price: 299.99,
    category: 'casa'
  },
  {
    name: 'Bicicleta Caloi Explorer Sport',
    description: 'Bicicleta mountain bike aro 29 com quadro de alumínio, 21 marchas Shimano e freios a disco mecânicos. Suspensão dianteira e pneus resistentes para trilhas e cidade.',
    price: 1899.99,
    category: 'esportes'
  }
];

// Função para conectar ao banco
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error.message);
    process.exit(1);
  }
}

// Nomes de autores para reviews aleatórias
const reviewAuthors = [
  'Ana Silva', 'João Santos', 'Maria Oliveira', 'Pedro Costa', 'Carla Souza',
  'Lucas Ferreira', 'Juliana Lima', 'Rafael Alves', 'Fernanda Rocha', 'Bruno Martins',
  'Camila Pereira', 'Diego Ribeiro', 'Larissa Cardoso', 'Thiago Nascimento', 'Beatriz Gomes',
  'Gabriel Barbosa', 'Natália Dias', 'Rodrigo Mendes', 'Isabela Castro', 'Felipe Araújo',
  'Amanda Torres', 'Gustavo Ramos', 'Priscila Moreira', 'Vinícius Correia', 'Letícia Freitas'
];

// Comentários base para reviews aleatórias
const reviewComments = {
  5: [
    'Produto excelente! Superou minhas expectativas.',
    'Qualidade incrível, recomendo muito!',
    'Perfeito! Chegou rápido e bem embalado.',
    'Melhor compra que já fiz, produto top!',
    'Qualidade excepcional, vale cada centavo.',
    'Produto fantástico, muito satisfeito!',
    'Excelente custo-benefício, recomendo!',
    'Produto de alta qualidade, adorei!'
  ],
  4: [
    'Muito bom produto, recomendo.',
    'Boa qualidade, atendeu às expectativas.',
    'Produto bom, pequenos detalhes a melhorar.',
    'Gostei bastante, boa compra.',
    'Qualidade boa, entrega rápida.',
    'Produto satisfatório, vale a pena.',
    'Bom custo-benefício, recomendo.',
    'Produto de qualidade, gostei.'
  ],
  3: [
    'Produto razoável, dentro do esperado.',
    'Ok, nada excepcional mas funciona bem.',
    'Produto mediano, serve para o propósito.',
    'Qualidade ok, preço justo.',
    'Produto comum, sem grandes surpresas.',
    'Atende ao básico, qualidade regular.',
    'Produto simples mas funcional.',
    'Razoável, poderia ser melhor.'
  ],
  2: [
    'Produto com alguns problemas.',
    'Qualidade abaixo do esperado.',
    'Produto ok, mas tem defeitos.',
    'Não gostei muito, qualidade ruim.',
    'Produto com falhas, não recomendo.',
    'Qualidade questionável, decepcionante.',
    'Produto fraco, esperava mais.',
    'Não vale o preço, qualidade baixa.'
  ],
  1: [
    'Produto muito ruim, não recomendo.',
    'Péssima qualidade, dinheiro jogado fora.',
    'Produto defeituoso, muito insatisfeito.',
    'Horrível, não comprem este produto.',
    'Qualidade péssima, produto inútil.',
    'Muito ruim, total decepção.',
    'Produto de baixíssima qualidade.',
    'Não funciona, produto terrível.'
  ]
};

// Função para gerar review aleatória
function generateRandomReview(productId) {
  const rating = Math.floor(Math.random() * 5) + 1; // 1 a 5
  const author = reviewAuthors[Math.floor(Math.random() * reviewAuthors.length)];
  const comments = reviewComments[rating];
  const comment = comments[Math.floor(Math.random() * comments.length)];

  // Data aleatória nos últimos 6 meses
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - (6 * 30 * 24 * 60 * 60 * 1000));
  const randomDate = new Date(sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime()));

  return {
    productId,
    author,
    rating,
    comment,
    createdAt: randomDate
  };
}

// Função para limpar e inserir dados
async function seedDatabase() {
  try {
    console.log('🗑️  Limpando dados existentes...');
    await Product.deleteMany({});
    await Review.deleteMany({});

    console.log('🌱 Inserindo produtos de exemplo...');
    const products = await Product.insertMany(sampleProducts);

    console.log('⭐ Gerando reviews aleatórias...');
    const allReviews = [];

    for (const product of products) {
      // Número aleatório de reviews entre 0 e 24
      const numReviews = Math.floor(Math.random() * 25);

      console.log(`   📝 Gerando ${numReviews} reviews para "${product.name}"`);

      for (let i = 0; i < numReviews; i++) {
        const review = generateRandomReview(product._id);
        allReviews.push(review);
      }
    }

    if (allReviews.length > 0) {
      await Review.insertMany(allReviews);
      console.log(`✅ ${allReviews.length} reviews inseridas com sucesso!`);
    }

    console.log(`✅ ${products.length} produtos inseridos com sucesso!`);
    console.log('\n📋 Produtos criados:');

    for (const product of products) {
      const reviewCount = await Review.countDocuments({ productId: product._id });
      console.log(`${products.indexOf(product) + 1}. ${product.name} - R$ ${product.price.toFixed(2)} (${reviewCount} reviews)`);
    }

  } catch (error) {
    console.error('❌ Erro ao inserir dados:', error.message);
  }
}

// Função principal
async function main() {
  console.log('🚀 Iniciando seed do banco de dados...\n');

  await connectDB();
  await seedDatabase();

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('💡 Agora você pode testar a integração frontend-backend\n');

  await mongoose.connection.close();
  console.log('🔌 Conexão com MongoDB fechada');
  process.exit(0);
}

// Executar se chamado diretamente
if (process.argv[1].endsWith('seed.js')) {
  main().catch(error => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });
}

export { sampleProducts, seedDatabase };
