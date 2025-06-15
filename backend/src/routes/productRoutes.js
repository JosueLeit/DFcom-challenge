import express from 'express';
import productController from '../controllers/productController.js';

const router = express.Router();

// GET /products - Listar todos os produtos
router.get('/', productController.getAllProducts);

// GET /products/top-rated - Listar produtos ordenados por rating (mais bem avaliados primeiro)
router.get('/top-rated', productController.getTopRatedProducts);

// POST /products - Criar novo produto
router.post('/', productController.createProduct);

// GET /products/:id - Obter produto por ID
router.get('/:id', productController.getProductById);

// PUT /products/:id - Atualizar produto
router.put('/:id', productController.updateProduct);

// DELETE /products/:id - Deletar produto
router.delete('/:id', productController.deleteProduct);

// GET /products/:id/rating-average - Obter média das avaliações
router.get('/:id/rating-average', productController.getProductRatingAverage);

// Rotas de avaliações aninhadas em produtos
import reviewController from '../controllers/reviewController.js';

// POST /products/:productId/reviews - Criar avaliação para produto
router.post('/:productId/reviews', reviewController.createReview);

// GET /products/:productId/reviews - Listar avaliações de produto
router.get('/:productId/reviews', reviewController.getAllReviews);

export default router;
