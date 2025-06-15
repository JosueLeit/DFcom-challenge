import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductStore } from '../stores/productStore';
import ProductForm from '../components/Product/ProductForm';

const ProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    loading, 
    error, 
    createProduct, 
    updateProduct, 
    getProductById 
  } = useProductStore();

  const [initialData, setInitialData] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);

  const isEditing = Boolean(id);

  // Carregar produto para edição
  useEffect(() => {
    const loadProductForEdit = async () => {
      if (isEditing && id) {
        try {
          setPageLoading(true);
          const product = await getProductById(id);
          setInitialData(product);
        } catch (error) {
          console.error('Erro ao carregar produto para edição:', error);
        } finally {
          setPageLoading(false);
        }
      }
    };

    loadProductForEdit();
  }, [id, isEditing, getProductById]);

  // Função para lidar com submissão do formulário
  const handleSubmit = async (formData) => {
    try {
      if (isEditing) {
        await updateProduct(id, formData);
      } else {
        await createProduct(formData);
      }
      navigate('/');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    }
  };

  // Função para cancelar e voltar
  const handleCancel = () => {
    navigate('/');
  };

  // Se está editando mas ainda não carregou o produto
  if (isEditing && pageLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Carregando produto...</span>
      </div>
    );
  }

  // Se está editando mas produto não foi encontrado
  if (isEditing && !pageLoading && !initialData) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Produto não encontrado</h2>
        <p className="text-gray-600 mb-6">
          O produto que você está tentando editar não existe ou foi removido.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Voltar para lista
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header da página */}
      <div className="mb-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <button 
            onClick={() => navigate('/')}
            className="hover:text-gray-700"
          >
            Produtos
          </button>
          <span>/</span>
          <span className="text-gray-900">
            {isEditing ? 'Editar Produto' : 'Novo Produto'}
          </span>
        </nav>
        
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Editar Produto' : 'Criar Novo Produto'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing 
              ? 'Atualize as informações do produto'
              : 'Preencha os dados para criar um novo produto'
            }
          </p>
        </div>
      </div>

      {/* Formulário */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <ProductForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default ProductFormPage; 