import React from 'react';

const ProductCard = ({ product, onView, onEdit, onDelete }) => {
  // Função para formatar preço em Real brasileiro
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Função para formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Função para truncar descrição
  const truncateDescription = (description, maxLength = 100) => {
    if (!description) return 'Sem descrição disponível';
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  // Função para renderizar estrelas
  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating);
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-sm ${i <= roundedRating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Handler para clique no card
  const handleCardClick = (e) => {
    // Evita que o clique nos botões acione o clique do card
    if (e.target.closest('button')) {
      return;
    }
    if (onView) {
      onView(product);
    }
  };

  return (
    <article
      className="h-full flex flex-col bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden"
      data-testid="product-card"
    >
      {/* Container do conteúdo que se expande para empurrar o rodapé para baixo */}
      <div className="flex-1 flex flex-col p-6" onClick={handleCardClick} role="presentation">
        {/* Seção Superior: Título, Preço, Categoria */}
        <div className="flex-shrink-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2" style={{ minHeight: '2.5rem' }}>
              {product.name}
            </h3>
            <span className="ml-2 flex-shrink-0 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {product.category}
            </span>
          </div>
          <p className="text-2xl font-extrabold text-green-600 mb-2">
            {formatPrice(product.price)}
          </p>
        </div>

        {/* Seção Intermediária: Descrição (ocupa o espaço disponível) */}
        <div className="flex-1 my-4">
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
            {product.description || 'Sem descrição disponível.'}
          </p>
        </div>

        {/* Seção Inferior do Conteúdo: Data */}
        <div className="flex-shrink-0">
          <div className="text-xs text-gray-400">
            Criado em: {formatDate(product.createdAt)}
          </div>
        </div>
      </div>

      {/* Rodapé Fixo com Botões de Ação */}
      <div className="flex-shrink-0 p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex gap-2">
          <button
            onClick={() => onView(product)}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Ver Detalhes
          </button>
          <button
            onClick={() => onEdit(product)}
            className="p-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 transition-colors"
            aria-label="Editar"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM5 13V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V13a2 2 0 01-2 2H7a2 2 0 01-2-2z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            aria-label="Excluir"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard; 