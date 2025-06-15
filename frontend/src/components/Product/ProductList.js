import React from 'react';

const ProductList = ({ 
  products = [], 
  loading = false, 
  error = null, 
  onView, 
  onEdit, 
  onDelete,
  emptyMessage = "Nenhum produto encontrado"
}) => {
  
  // Função para formatar preço
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Renderização do loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  // Renderização do erro
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar produtos</h3>
        <p className="text-gray-500 mb-4">{error}</p>
      </div>
    );
  }

  // Renderização da lista vazia
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8L9 5v11l10-6z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  // Renderização da lista de produtos
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200 flex flex-col"
          >
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2 space-x-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 break-all min-w-0">
                    {product.name}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex-shrink-0">
                    {product.category}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {product.description}
                </p>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(product.price)}
                </span>
              </div>

              {/* Botões de ação */}
              <div className="flex gap-2">
                {onView && (
                  <button
                    onClick={() => onView(product)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Ver Detalhes
                  </button>
                )}
                
                {onEdit && (
                  <button
                    onClick={() => onEdit(product)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    ✏️
                  </button>
                )}
                
                {onDelete && (
                  <button
                    onClick={() => onDelete(product)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Mostrando {products.length} produto{products.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductList; 