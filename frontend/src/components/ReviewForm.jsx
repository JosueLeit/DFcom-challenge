import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewForm = ({ review = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    author: '',
    rating: 5,
    comment: ''
  });
  const [errors, setErrors] = useState({});
  const [hoveredRating, setHoveredRating] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (review) {
      setFormData({
        author: review.author,
        rating: review.rating,
        comment: review.comment
      });
    }
  }, [review]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpa o erro do campo quando ele é alterado
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validação do nome
    if (!formData.author.trim()) {
      newErrors.author = 'O nome é obrigatório';
    } else if (formData.author.trim().length < 2) {
      newErrors.author = 'O nome deve ter pelo menos 2 caracteres';
    } else if (formData.author.trim().length > 100) {
      newErrors.author = 'O nome deve ter no máximo 100 caracteres';
    }

    // Validação do comentário
    if (!formData.comment.trim()) {
      newErrors.comment = 'O comentário é obrigatório';
    } else if (formData.comment.trim().length < 3) {
      newErrors.comment = 'O comentário deve ter pelo menos 3 caracteres';
    } else if (formData.comment.trim().length > 500) {
      newErrors.comment = 'O comentário deve ter no máximo 500 caracteres';
    }

    // Validação da avaliação
    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'A avaliação deve ser entre 1 e 5 estrelas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        ...formData,
        author: formData.author.trim(),
        comment: formData.comment.trim()
      });
      
      // Limpa o formulário se não for edição
      if (!review) {
        setFormData({
          author: '',
          rating: 5,
          comment: ''
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <label htmlFor="author" className="block text-gray-700 font-medium mb-2">
          Nome
        </label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          disabled={isSubmitting}
          maxLength={100}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.author ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
          } ${isSubmitting ? 'bg-gray-100' : ''}`}
          placeholder="Seu nome"
        />
        {errors.author && (
          <p className="text-red-500 text-sm mt-1">{errors.author}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Avaliação
        </label>
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => !isSubmitting && setFormData(prev => ({ ...prev, rating: star }))}
              onMouseEnter={() => !isSubmitting && setHoveredRating(star)}
              onMouseLeave={() => !isSubmitting && setHoveredRating(null)}
              disabled={isSubmitting}
              className={`text-2xl focus:outline-none ${isSubmitting ? 'cursor-not-allowed opacity-70' : ''}`}
            >
              <FaStar
                className={`${
                  star <= (hoveredRating || formData.rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                } transition-colors`}
              />
            </button>
          ))}
        </div>
        {errors.rating && (
          <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="comment" className="block text-gray-700 font-medium mb-2">
          Comentário
        </label>
        <textarea
          id="comment"
          name="comment"
          value={formData.comment}
          onChange={handleChange}
          disabled={isSubmitting}
          maxLength={500}
          rows="4"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.comment ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
          } ${isSubmitting ? 'bg-gray-100' : ''}`}
          placeholder="Conte-nos sua experiência com o produto"
        />
        <div className="flex justify-between items-center mt-1">
          {errors.comment && (
            <p className="text-red-500 text-sm">{errors.comment}</p>
          )}
          <span className="text-gray-500 text-sm">
            {formData.comment.length}/500
          </span>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className={`px-4 py-2 text-gray-600 hover:text-gray-800 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {review ? 'Atualizando...' : 'Enviando...'}
            </span>
          ) : (
            <>{review ? 'Atualizar' : 'Enviar'} Avaliação</>
          )}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm; 