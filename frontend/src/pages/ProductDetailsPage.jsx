import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useProductStore } from '../stores/productStore';
import { useReviewStore } from '../stores/reviewStore';
import ReviewList from '../components/ReviewList';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [ratingAverage, setRatingAverage] = useState(null);

  const { getProductById, deleteProduct } = useProductStore();
  const { getProductRatingAverage } = useReviewStore();

  // Função para atualizar média das avaliações
  const updateRatingAverage = useCallback(async () => {
    try {
      const ratingData = await getProductRatingAverage(id);
      setRatingAverage(ratingData);
    } catch (err) {
      console.error('Erro ao atualizar média das avaliações:', err);
    }
  }, [id, getProductRatingAverage]);

  // Carregar dados do produto
  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Carregar produto e média em paralelo
        const [productData, ratingData] = await Promise.all([
          getProductById(id),
          getProductRatingAverage(id)
        ]);

        setProduct(productData);
        setRatingAverage(ratingData);
      } catch (err) {
        console.error('Erro ao carregar dados do produto:', err);
        setError('Não foi possível carregar os dados do produto');
        toast.error('Erro ao carregar dados do produto');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProductData();
    }
  }, [id, getProductById, getProductRatingAverage]);

  // Função para deletar produto
  const handleDelete = async () => {
    try {
      // Criar um toast de confirmação personalizado
      const confirmationToastId = toast.info(
        <div>
          <p>Tem certeza que deseja excluir "{product.name}"?</p>
          <div className="mt-2 flex justify-end gap-2">
            <button 
              onClick={() => {
                toast.dismiss(confirmationToastId);
              }}
              className="px-2 py-1 bg-gray-200 text-gray-800 rounded"
            >
              Cancelar
            </button>
            <button 
              onClick={async () => {
                toast.dismiss(confirmationToastId);
                try {
                  await toast.promise(
                    deleteProduct(product._id),
                    {
                      pending: 'Excluindo produto...',
                      success: 'Produto excluído com sucesso!',
                      error: 'Erro ao excluir produto'
                    }
                  );
                  navigate('/');
                } catch (error) {
                  console.error('Erro ao deletar produto:', error);
                }
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
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      toast.error('Erro ao excluir produto: ' + error.message);
    }
  };

  // Renderizar estrelas
  const renderStars = useCallback((rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-xl ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  }, []);

  // Função para formatar preço
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold text-red-600 mb-4">
          {error || 'Produto não encontrado'}
        </h2>
        <Link
          to="/products"
          className="text-blue-500 hover:text-blue-700 transition-colors"
        >
          ← Voltar para lista de produtos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link to="/" className="hover:text-blue-600">
              Produtos
            </Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li className="text-gray-900 font-medium truncate">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informações principais */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {product.category}
              </span>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-4xl font-bold text-green-600">
                {formatPrice(product.price)}
              </span>
              
              <div className="flex gap-2">
                <Link
                  to={`/products/${product._id}/edit`}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-medium"
                >
                  Editar Produto
                </Link>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium"
                >
                  Excluir
                </button>
              </div>
            </div>

            {/* Especificações */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Especificações</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {product.specifications?.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas de Avaliações */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo das Avaliações</h3>
            
            {ratingAverage && ratingAverage.totalReviews > 0 ? (
              <div>
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    {renderStars(Math.round(ratingAverage.averageRating))}
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {ratingAverage.averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-500 ml-2">
                    ({ratingAverage.totalReviews} avaliação{ratingAverage.totalReviews !== 1 ? 'ões' : ''})
                  </span>
                </div>
                
                {/* Distribuição de estrelas */}
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="flex items-center">
                      <span className="text-sm text-gray-600 w-8">{star}★</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{
                            width: `${ratingAverage.totalReviews > 0 
                              ? (ratingAverage.ratingCounts[star] / ratingAverage.totalReviews) * 100 
                              : 0}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">
                        {ratingAverage.ratingCounts[star]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Nenhuma avaliação ainda</p>
            )}
          </div>
        </div>
      </div>

      {/* Lista de avaliações */}
      <div className="mt-8 bg-white rounded-lg shadow-md">
        <div className="p-6">
          <ReviewList 
            productId={product._id} 
            onReviewChange={setRatingAverage}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;