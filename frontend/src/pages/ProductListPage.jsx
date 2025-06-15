import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProductStore } from '../stores/productStore';
import ProductList from '../components/Product/ProductList';
import Pagination from '../components/Common/Pagination';
import { toast } from 'react-toastify';

const ProductListPage = () => {
  const navigate = useNavigate();
  const { 
    products, 
    loading, 
    error, 
    pagination,
    fetchProducts,
    getTopRatedProducts,
    deleteProduct,
    setProducts 
  } = useProductStore();

  const [filters, setFilters] = useState({
    category: '',
    search: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('rating'); // 'rating' ou 'date'

  // Carregar produtos ao montar o componente e quando filtros/página mudam
  useEffect(() => {
    const params = {
      page: currentPage,
      limit: 10,
      ...filters
    };
    
    // Só incluir filtros que não estão vazios
    Object.keys(params).forEach(key => {
      if (!params[key]) delete params[key];
    });
    
    // Usar função apropriada baseada na ordenação
    if (sortBy === 'rating') {
      getTopRatedProducts(params);
    } else {
      fetchProducts(params);
    }
  }, [fetchProducts, getTopRatedProducts, currentPage, filters, sortBy]);

  // Resetar página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.category, filters.search, sortBy]);

  // Função para lidar com mudança de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll para o topo da página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Função para lidar com visualização de produto
  const handleViewProduct = (product) => {
    navigate(`/products/${product._id}`);
  };

  // Função para lidar com edição de produto
  const handleEditProduct = (product) => {
    navigate(`/products/${product._id}/edit`);
  };

  // Função para lidar com exclusão de produto
  const handleDeleteProduct = async (product) => {
    try {
      const result = await toast.promise(
        new Promise((resolve) => {
          toast.info(
            <div>
              <p>Tem certeza que deseja excluir "{product.name}"?</p>
              <div className="mt-2 flex justify-end gap-2">
                <button 
                  onClick={() => resolve(false)}
                  className="px-2 py-1 bg-gray-200 text-gray-800 rounded"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => resolve(true)}
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
        }),
        {
          pending: 'Aguardando confirmação...',
          success: 'Produto excluído com sucesso!',
          error: 'Erro ao excluir produto'
        }
      );

      if (result) {
        await deleteProduct(product._id);
        // Recarregar a página atual após exclusão
        const params = {
          page: currentPage,
          limit: 10,
          ...filters
        };
        
        Object.keys(params).forEach(key => {
          if (!params[key]) delete params[key];
        });
        
        // Usar função apropriada baseada na ordenação
        if (sortBy === 'rating') {
          getTopRatedProducts(params);
        } else {
          fetchProducts(params);
        }
      }
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      toast.error('Erro ao excluir produto: ' + error.message);
    }
  };

  // Função para limpar filtros
  const clearFilters = () => {
    setFilters({ category: '', search: '' });
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Header da página */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600 mt-1">
            Gerencie seus produtos de forma fácil e intuitiva
          </p>
        </div>
        <Link
          to="/products/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          + Novo Produto
        </Link>
      </div>

      {/* Filtros */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <label htmlFor="search" className="sr-only">Buscar produtos</label>
            <input
              type="text"
              id="search"
              placeholder="Buscar produtos..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="min-w-48">
            <label htmlFor="category" className="sr-only">Filtrar por categoria</label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todas as categorias</option>
              <option value="eletrônicos">Eletrônicos</option>
              <option value="roupas">Roupas</option>
              <option value="casa">Casa</option>
              <option value="esportes">Esportes</option>
              <option value="livros">Livros</option>
              <option value="saúde">Saúde</option>
              <option value="beleza">Beleza</option>
              <option value="brinquedos">Brinquedos</option>
              <option value="alimentação">Alimentação</option>
              <option value="outros">Outros</option>
            </select>
          </div>
          <div className="min-w-48">
            <label htmlFor="sortBy" className="sr-only">Ordenar por</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="rating">⭐ Mais bem avaliados</option>
              <option value="date">📅 Mais recentes</option>
            </select>
          </div>
          {(filters.search || filters.category) && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Limpar filtros
            </button>
          )}
        </div>
        
        {/* Indicador de filtros ativos */}
        {(filters.search || filters.category) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Busca: "{filters.search}"
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Categoria: {filters.category}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Lista de produtos */}
      {/* Contador de produtos - DIRETO NA PÁGINA */}
      {!loading && !error && pagination?.totalProducts && (
        <div className="mb-6">
          <p className="text-gray-600">
            {pagination.totalProducts === 1 
              ? '1 produto encontrado'
              : `${pagination.totalProducts} produtos encontrados`
            }
          </p>
        </div>
      )}
      
      <ProductList
        products={products}
        loading={loading}
        error={error}
        onView={handleViewProduct}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        hasMore={false}
        onLoadMore={() => {}}
        filters={filters}
        totalProducts={pagination?.totalProducts}
        emptyMessage={
          products.length === 0 
            ? "Nenhum produto cadastrado ainda. Que tal criar o primeiro?"
            : ""
        }
      />

      {/* Paginação */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalProducts}
        hasNextPage={pagination.hasNextPage}
        hasPrevPage={pagination.hasPrevPage}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  );
};

export default ProductListPage; 