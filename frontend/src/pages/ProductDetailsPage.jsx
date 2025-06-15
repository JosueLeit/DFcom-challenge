import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useProductStore } from '../stores/productStore';
import { useReviewStore } from '../stores/reviewStore';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [ratingAverage, setRatingAverage] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    comment: ''
  });

  const { getProductById, deleteProduct } = useProductStore();
  const { getReviewsByProduct, createReview, getProductRatingAverage } = useReviewStore();

  // Carregar dados do produto
  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Carregar produto, avaliações e média em paralelo
        const [productData, reviewsData, ratingData] = await Promise.all([
          getProductById(id),
          getReviewsByProduct(id),
          getProductRatingAverage(id)
        ]);

        setProduct(productData);
        setReviews(reviewsData);
        setRatingAverage(ratingData);
      } catch (err) {
        console.error('Erro ao carregar dados do produto:', err);
        setError('Não foi possível carregar os dados do produto');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProductData();
    }
  }, [id, getProductById, getReviewsByProduct, getProductRatingAverage]);

  // Função para deletar produto
  const handleDelete = async () => {
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
        navigate('/');
      }
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      toast.error('Erro ao excluir produto: ' + error.message);
    }
  };

  // Função para renderizar estrelas
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`text-xl ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Função para submeter nova avaliação
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!newReview.author.trim() || !newReview.comment.trim()) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Validação adicional
    if (newReview.comment.trim().length < 3) {
      toast.error('O comentário deve ter pelo menos 3 caracteres');
      return;
    }

    if (newReview.author.trim().length < 2) {
      toast.error('O nome deve ter pelo menos 2 caracteres');
      return;
    }

    try {
      await createReview(id, newReview);
      
      // Recarregar avaliações e média
      const [reviewsData, ratingData] = await Promise.all([
        getReviewsByProduct(id),
        getProductRatingAverage(id)
      ]);
      
      setReviews(reviewsData);
      setRatingAverage(ratingData);
      setShowReviewForm(false);
      setNewReview({ author: '', rating: 5, comment: '' });
      
      toast.success('Avaliação adicionada com sucesso!');
    } catch (err) {
      console.error('Erro ao criar avaliação:', err);
      
      // Melhor tratamento de erro baseado na resposta do servidor
      if (err.response?.data?.details && Array.isArray(err.response.data.details)) {
        const errorMessages = err.response.data.details.map(detail => 
          `${detail?.field || 'Campo'}: ${detail?.message || 'Erro de validação'}`
        ).join('\n');
        toast.error(`Erro de validação:\n${errorMessages}`);
      } else if (err.response?.data?.message) {
        toast.error(`Erro: ${err.response.data.message}`);
      } else {
        toast.error('Erro ao adicionar avaliação. Tente novamente.');
      }
    }
  };

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
          <p className="text-gray-600">Carregando produto...</p>
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar produto</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Voltar para produtos
        </button>
      </div>
    );
  }

  // Renderização se produto não encontrado
  if (!product) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Produto não encontrado</h3>
        <p className="text-gray-500 mb-4">O produto que você está procurando não existe.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Voltar para produtos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
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

      {/* Informações do Produto */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informações principais */}
          <div>
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
          </div>

          {/* Estatísticas de Avaliações */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Avaliações</h3>
            
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
            
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
            >
              {showReviewForm ? 'Cancelar' : 'Escrever Avaliação'}
            </button>
          </div>
        </div>
      </div>

      {/* Formulário de Nova Avaliação */}
      {showReviewForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nova Avaliação</h3>
          
          <form onSubmit={handleSubmitReview}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                  Seu Nome *
                </label>
                <input
                  type="text"
                  id="author"
                  value={newReview.author}
                  onChange={(e) => setNewReview(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                  Nota
                </label>
                <select
                  id="rating"
                  value={newReview.rating}
                  onChange={(e) => setNewReview(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[5, 4, 3, 2, 1].map(rating => (
                    <option key={rating} value={rating}>
                      {rating} estrela{rating !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Comentário *
              </label>
              <textarea
                id="comment"
                rows={4}
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Compartilhe sua experiência com este produto..."
                required
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium"
              >
                Publicar Avaliação
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Avaliações */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Avaliações ({reviews.length})
        </h3>
        
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{review.author}</h4>
                    <div className="flex items-center mt-1">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            Nenhuma avaliação ainda. Seja o primeiro a avaliar este produto!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;