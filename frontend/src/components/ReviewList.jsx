import React, { useState, useEffect, useCallback } from 'react';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import reviewService from '../services/reviewService';
import { useReviewStore } from '../stores/reviewStore';
import { toast } from 'react-toastify';

const ReviewList = ({ productId, onReviewChange }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const { getProductRatingAverage } = useReviewStore();

  // Função para atualizar o resumo das avaliações com debounce
  const updateRatingAverage = useCallback(async () => {
    if (!onReviewChange) return;
    
    try {
      const ratingData = await getProductRatingAverage(productId);
      onReviewChange(ratingData);
    } catch (error) {
      console.error('Erro ao atualizar média das avaliações:', error);
    }
  }, [productId, getProductRatingAverage, onReviewChange]);

  // Efeito para carregar avaliações iniciais
  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const reviewsData = await reviewService.getReviewsByProduct(productId);
      setReviews(reviewsData);
      
      // Atualiza o resumo das avaliações apenas na carga inicial
      await updateRatingAverage();
    } catch (error) {
      toast.error('Erro ao carregar avaliações: ' + (error.message || 'Tente novamente mais tarde'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      let updatedReview;
      
      if (editingReview) {
        // Atualizar avaliação existente
        updatedReview = await reviewService.updateReview(editingReview._id, formData);
        setReviews(reviews.map(review => 
          review._id === editingReview._id ? updatedReview : review
        ));
        toast.success('Avaliação atualizada com sucesso!');
      } else {
        // Criar nova avaliação
        updatedReview = await reviewService.createReview(productId, formData);
        setReviews([updatedReview, ...reviews]);
        toast.success('Avaliação enviada com sucesso!');
      }
      
      setShowForm(false);
      setEditingReview(null);

      // Atualiza o resumo após a modificação
      await updateRatingAverage();
    } catch (error) {
      const errorMessage = error.message || error.details?.map(d => d.message).join(', ') || 'Tente novamente mais tarde';
      toast.error('Erro ao salvar avaliação: ' + errorMessage);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleDelete = async (reviewId) => {
    try {
      let confirmToastId = null;

      const result = await new Promise((resolve) => {
        confirmToastId = toast.info(
          <div>
            <p>Tem certeza que deseja excluir esta avaliação?</p>
            <div className="mt-2 flex justify-end gap-2">
              <button 
                onClick={() => {
                  toast.dismiss(confirmToastId);
                  resolve(false);
                }}
                className="px-2 py-1 bg-gray-200 text-gray-800 rounded"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  toast.dismiss(confirmToastId);
                  resolve(true);
                }}
                className="px-2 py-1 bg-red-500 text-white rounded"
              >
                Excluir
              </button>
            </div>
          </div>,
          {
            autoClose: false,
            closeButton: false,
            closeOnClick: false,
          }
        );
      });

      if (result) {
        await toast.promise(
          reviewService.deleteReview(reviewId),
          {
            pending: 'Excluindo avaliação...',
            success: 'Avaliação excluída com sucesso!',
            error: 'Erro ao excluir avaliação'
          }
        );

        // Atualiza a lista local
        setReviews(reviews.filter(review => review._id !== reviewId));

        // Atualiza o resumo após a exclusão
        await updateRatingAverage();
      }
    } catch (error) {
      console.error('Erro ao excluir avaliação:', error);
      toast.error('Erro ao excluir avaliação: ' + (error.message || 'Tente novamente mais tarde'));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingReview(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">
          Avaliações ({reviews.length})
        </h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Avaliar Produto
          </button>
        )}
      </div>

      {showForm && (
        <ReviewForm
          review={editingReview}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map(review => (
            <ReviewItem
              key={review._id}
              review={review}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">
          Ainda não há avaliações para este produto. Seja o primeiro a avaliar!
        </p>
      )}
    </div>
  );
};

export default ReviewList; 