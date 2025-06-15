import express from 'express';
import reviewController from '../controllers/reviewController.js';

const router = express.Router();

// GET /reviews/:id - Obter avaliação por ID
router.get('/:id', reviewController.getReviewById);

// PUT /reviews/:id - Atualizar avaliação
router.put('/:id', reviewController.updateReview);

// DELETE /reviews/:id - Deletar avaliação
router.delete('/:id', reviewController.deleteReview);

export default router;
