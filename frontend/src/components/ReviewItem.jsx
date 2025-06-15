import React, { useState } from 'react';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ReviewItem = ({ review, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-4 mb-4 transition-shadow ${
        isHovered ? 'shadow-lg' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-lg">{review.author}</h4>
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={`${
                  index < review.rating ? 'text-yellow-400' : 'text-gray-300'
                } transition-colors`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-500">
              {format(new Date(review.createdAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </span>
          </div>
        </div>
        <div className={`flex space-x-3 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={() => onEdit(review)}
            className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-full hover:bg-blue-50"
            title="Editar avaliação"
          >
            <FaEdit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(review._id)}
            className="text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors p-2 rounded-full"
            title="Excluir avaliação"
          >
            <FaTrash className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {review.comment}
        </p>
      </div>
      {review.updatedAt && review.updatedAt !== review.createdAt && (
        <p className="text-xs text-gray-400 mt-2 italic">
          Editado em {format(new Date(review.updatedAt), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      )}
    </div>
  );
};

export default ReviewItem; 