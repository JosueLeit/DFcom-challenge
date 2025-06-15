import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  hasNextPage, 
  hasPrevPage, 
  onPageChange,
  loading = false 
}) => {
  // Não renderizar se não há páginas suficientes
  if (totalPages <= 1) return null;

  // Gerar array de páginas para mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Mostrar todas as páginas se forem poucas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas com ellipsis
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, currentPage + 2);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      {/* Informações sobre os resultados */}
      <div className="text-sm text-gray-700">
        Mostrando página <span className="font-medium">{currentPage}</span> de{' '}
        <span className="font-medium">{totalPages}</span>
        {totalItems && (
          <>
            {' '}({totalItems} {totalItems === 1 ? 'item' : 'itens'} no total)
          </>
        )}
      </div>

      {/* Controles de paginação */}
      <div className="flex items-center space-x-1">
        {/* Botão Anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage || loading}
          className={`
            px-3 py-2 text-sm font-medium rounded-md transition-colors
            ${!hasPrevPage || loading
              ? 'text-gray-400 cursor-not-allowed bg-gray-100'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900'
            }
          `}
          aria-label="Página anterior"
        >
          ← Anterior
        </button>

        {/* Números das páginas */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-sm text-gray-500"
                >
                  ...
                </span>
              );
            }

            const isCurrentPage = page === currentPage;
            
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                disabled={loading}
                className={`
                  px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${isCurrentPage
                    ? 'bg-blue-600 text-white border border-blue-600'
                    : loading
                    ? 'text-gray-400 cursor-not-allowed bg-gray-100'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                aria-label={`Página ${page}`}
                aria-current={isCurrentPage ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Botão Próximo */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage || loading}
          className={`
            px-3 py-2 text-sm font-medium rounded-md transition-colors
            ${!hasNextPage || loading
              ? 'text-gray-400 cursor-not-allowed bg-gray-100'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900'
            }
          `}
          aria-label="Próxima página"
        >
          Próximo →
        </button>
      </div>
    </div>
  );
};

export default Pagination; 