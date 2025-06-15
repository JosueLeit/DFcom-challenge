import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({
  products = [],
  loading = false,
  error = null,
  title,
  emptyMessage = "Nenhum produto encontrado",
  onView,
  onEdit,
  onDelete,
  onRetry,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  appliedFilters,
  columns = 3,
  totalProducts,
}) => {
  // Renderizar skeleton durante loading
  const renderSkeletons = () => {
    return Array.from({ length: 6 }, (_, index) => (
      <div
        key={index}
        data-testid="product-skeleton"
        className="bg-white rounded-lg shadow-md p-6 animate-pulse"
      >
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-4"></div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded flex-1"></div>
          <div className="h-8 bg-gray-200 rounded flex-1"></div>
          <div className="h-8 bg-gray-200 rounded flex-1"></div>
        </div>
      </div>
    ));
  };

  // Renderizar estado de loading
  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        data-testid="loading-spinner"
        className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"
      ></div>
      <p className="text-gray-600">Carregando produtos...</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full">
        {renderSkeletons()}
      </div>
    </div>
  );

  // Renderizar estado de erro
  const renderError = () => (
    <div data-testid="error-message" className="text-center py-12">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-800 mb-2">Erro ao carregar</h3>
        <p className="text-red-600 mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Tentar Novamente
          </button>
        )}
      </div>
    </div>
  );

  // Renderizar estado vazio
  const renderEmpty = () => (
    <div data-testid="empty-state" className="text-center py-12">
      <div
        data-testid="empty-icon"
        className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full"
      >
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8L9 5v11l10-6z"></path>
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto</h3>
      <p className="text-gray-500">{emptyMessage}</p>
    </div>
  );

  // Renderizar filtros aplicados
  const renderAppliedFilters = () => {
    if (!appliedFilters || Object.keys(appliedFilters).length === 0) return null;
    
    return (
      <div data-testid="applied-filters" className="mb-6">
        <div className="flex flex-wrap gap-2">
          {Object.entries(appliedFilters).map(([key, value]) => (
            <span
              key={key}
              className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
            >
              {value}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar grid de produtos
  const renderProductGrid = () => {
    const gridColsClass = columns === 4 
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

    return (
      <div
        data-testid="products-grid"
        className={`grid ${gridColsClass} gap-6 items-stretch`}
      >
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  };

  // Renderizar botão "Carregar Mais"
  const renderLoadMoreButton = () => {
    if (!hasMore) return null;

    return (
      <div className="text-center mt-8">
        <button
          onClick={onLoadMore}
          disabled={loadingMore}
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loadingMore ? 'Carregando...' : 'Carregar Mais'}
        </button>
      </div>
    );
  };

  return (
    <div 
      className="product-list-container"
      data-testid="product-list"
      role="region"
      aria-label="Lista de produtos"
    >
      {/* Título da lista */}
      {title && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
      )}

      {/* Estados especiais */}
      {loading && renderLoading()}
      {error && !loading && renderError()}
      
      {/* Conteúdo principal */}
      {!loading && !error && (
        <>
          {/* Filtros aplicados */}
          {renderAppliedFilters()}
          
          {/* Lista de produtos ou estado vazio */}
          {products.length === 0 ? renderEmpty() : renderProductGrid()}
          
          {/* Botão carregar mais */}
          {renderLoadMoreButton()}
        </>
      )}
    </div>
  );
};

export default ProductList; 