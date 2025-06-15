import React, { useState, useEffect } from "react";

const ProductForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  error = null
}) => {
  // Estado inicial do formulário
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lista de categorias disponíveis
  const categories = [
    { value: '', label: 'Selecione uma categoria' },
    { value: 'eletrônicos', label: 'Eletrônicos' },
    { value: 'roupas', label: 'Roupas' },
    { value: 'casa', label: 'Casa' },
    { value: 'esportes', label: 'Esportes' },
    { value: 'livros', label: 'Livros' },
    { value: 'saúde', label: 'Saúde' },
    { value: 'beleza', label: 'Beleza' },
    { value: 'brinquedos', label: 'Brinquedos' },
    { value: 'alimentação', label: 'Alimentação' },
    { value: 'outros', label: 'Outros' }
  ];

  // Pré-preencher formulário quando initialData mudar (para edição)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price ? initialData.price.toString() : '',
        category: initialData.category || ''
      });
    }
  }, [initialData]);

  // Função para lidar com mudanças nos campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpar erro do campo quando usuário começar a digitar
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Função para validar formulário
  const validateForm = () => {
    const errors = {};

    // Validar nome
    if (!formData.name.trim()) {
      errors.name = 'Nome do produto é obrigatório';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validar descrição
    if (!formData.description.trim()) {
      errors.description = 'Descrição é obrigatória';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Descrição deve ter pelo menos 10 caracteres';
    }

    // Validar preço
    if (!formData.price.trim()) {
      errors.price = 'Preço é obrigatório';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        errors.price = 'Preço deve ser um número maior que zero';
      }
    }

    // Validar categoria
    if (!formData.category) {
      errors.category = 'Categoria é obrigatória';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Função para lidar com submissão do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar dados para envio
      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para resetar formulário
  const handleReset = () => {
    if (initialData) {
      // Se está editando, volta aos dados originais
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price ? initialData.price.toString() : '',
        category: initialData.category || ''
      });
    } else {
      // Se está criando, limpa o formulário
      setFormData({
        name: '',
        description: '',
        price: '',
        category: ''
      });
    }
    setFormErrors({});
  };

  // Função para formatar preço enquanto digita
  const handlePriceChange = (e) => {
    const value = e.target.value;
    // Permitir apenas números e ponto decimal
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      handleChange(e);
    }
  };

  const isEditing = Boolean(initialData);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mostrar erro geral se houver */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erro ao salvar produto
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Nome do Produto */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Produto *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.name 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-500'
            }`}
            placeholder="Digite o nome do produto"
            disabled={isSubmitting || loading}
          />
          {formErrors.name && (
            <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
          )}
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição *
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.description 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-gray-300 focus:border-blue-500'
            }`}
            placeholder="Descreva o produto detalhadamente"
            disabled={isSubmitting || loading}
          />
          {formErrors.description && (
            <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
          )}
        </div>

        {/* Preço e Categoria */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Preço */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Preço (R$) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">R$</span>
              </div>
              <input
                type="text"
                id="price"
                name="price"
                value={formData.price}
                onChange={handlePriceChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.price 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                placeholder="0.00"
                disabled={isSubmitting || loading}
              />
            </div>
            {formErrors.price && (
              <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
            )}
          </div>

          {/* Categoria */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Categoria *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.category 
                  ? 'border-red-300 focus:border-red-500' 
                  : 'border-gray-300 focus:border-blue-500'
              }`}
              disabled={isSubmitting || loading}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {formErrors.category && (
              <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
            )}
          </div>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="flex-1 sm:flex-none inline-flex justify-center items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting || loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEditing ? 'Atualizando...' : 'Criando...'}
            </>
          ) : (
            isEditing ? 'Atualizar Produto' : 'Criar Produto'
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={isSubmitting || loading}
          className="flex-1 sm:flex-none inline-flex justify-center items-center px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isEditing ? 'Resetar' : 'Limpar'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting || loading}
          className="flex-1 sm:flex-none inline-flex justify-center items-center px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
      </div>

      {/* Indicador de modo */}
      <div className="text-center">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {isEditing ? '✏️ Modo Edição' : '➕ Modo Criação'}
        </span>
      </div>
    </form>
  );
};

export default ProductForm;
