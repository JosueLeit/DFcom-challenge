import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react';
import '@testing-library/jest-dom';
import ProductDetailsPage from '../ProductDetailsPage';

// Mock do react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

// Mock dos stores
const mockProductStore = {
  getProductById: jest.fn(),
  deleteProduct: jest.fn()
};

const mockReviewStore = {
  getReviewsByProduct: jest.fn(),
  createReview: jest.fn(),
  getProductRatingAverage: jest.fn()
};

// Mock do react-router-dom
const mockNavigate = jest.fn();
const mockParams = { id: '1' };

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams
}));

// Mock dos stores
jest.mock('../../stores/productStore', () => ({
  useProductStore: () => mockProductStore
}));

jest.mock('../../stores/reviewStore', () => ({
  useReviewStore: () => mockReviewStore
}));

// Mock data
const mockProduct = {
  _id: '1',
  name: 'Smartphone Samsung',
  description: 'Smartphone com excelente qualidade',
  price: 1299.99,
  category: 'eletrônicos',
  createdAt: '2023-01-01T00:00:00.000Z'
};

const mockReviews = [
  {
    _id: 'review1',
    author: 'João Silva',
    rating: 5,
    comment: 'Excelente produto!',
    createdAt: '2023-01-01T00:00:00.000Z'
  },
  {
    _id: 'review2',
    author: 'Maria Santos',
    rating: 4,
    comment: 'Muito bom, recomendo.',
    createdAt: '2023-01-02T00:00:00.000Z'
  }
];

const mockRatingAverage = {
  averageRating: 4.5,
  totalReviews: 2,
  ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 1 }
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ProductDetailsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementations
    mockProductStore.getProductById.mockResolvedValue(mockProduct);
    mockReviewStore.getReviewsByProduct.mockResolvedValue(mockReviews);
    mockReviewStore.getProductRatingAverage.mockResolvedValue(mockRatingAverage);
    mockReviewStore.createReview.mockResolvedValue({});
  });

  describe('Carregamento de dados', () => {
    test('deve carregar dados do produto, reviews e média ao montar', async () => {
      renderWithRouter(<ProductDetailsPage />);

      await waitFor(() => {
        expect(mockProductStore.getProductById).toHaveBeenCalledWith('1');
        expect(mockReviewStore.getReviewsByProduct).toHaveBeenCalledWith('1');
        expect(mockReviewStore.getProductRatingAverage).toHaveBeenCalledWith('1');
      });
    });

    test('deve mostrar loading durante carregamento', () => {
      renderWithRouter(<ProductDetailsPage />);
      
      expect(screen.getByText(/carregando produto.../i)).toBeInTheDocument();
    });

    test('deve mostrar erro quando falha ao carregar', async () => {
      mockProductStore.getProductById.mockRejectedValue(new Error('Erro de rede'));
      
      renderWithRouter(<ProductDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText(/erro ao carregar produto/i)).toBeInTheDocument();
        expect(screen.getByText(/não foi possível carregar os dados do produto/i)).toBeInTheDocument();
      });
    });

    test('deve mostrar mensagem quando produto não encontrado', async () => {
      mockProductStore.getProductById.mockResolvedValue(null);
      
      renderWithRouter(<ProductDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText(/produto não encontrado/i)).toBeInTheDocument();
      });
    });
  });

  describe('Exibição do produto', () => {
    test('deve exibir informações do produto corretamente', async () => {
      renderWithRouter(<ProductDetailsPage />);

      await waitFor(() => {
        // Usar getAllByText pois aparece no breadcrumb e título
        const productNames = screen.getAllByText('Smartphone Samsung');
        expect(productNames.length).toBeGreaterThan(0);
        expect(screen.getByText('Smartphone com excelente qualidade')).toBeInTheDocument();
        expect(screen.getByText('R$ 1.299,99')).toBeInTheDocument();
        expect(screen.getByText('eletrônicos')).toBeInTheDocument();
      });
    });

    test('deve exibir breadcrumb corretamente', async () => {
      renderWithRouter(<ProductDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('Produtos')).toBeInTheDocument();
        // Verificar se existem múltiplas ocorrências do nome do produto
        const productNames = screen.getAllByText('Smartphone Samsung');
        expect(productNames.length).toBeGreaterThan(0);
      });
    });

    test('deve exibir botões de ação', async () => {
      renderWithRouter(<ProductDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText(/editar produto/i)).toBeInTheDocument();
        expect(screen.getByText(/excluir/i)).toBeInTheDocument();
      });
    });
  });

  describe('Sistema de avaliações', () => {
    test('deve exibir estatísticas de avaliações', async () => {
      renderWithRouter(<ProductDetailsPage />);

      await waitFor(() => {
        // Verificar se a média das avaliações está sendo exibida
        expect(screen.getByText('4.5')).toBeInTheDocument();
        // Verificar se há texto relacionado a avaliações
        expect(screen.getByText(/avaliação/)).toBeInTheDocument();
      });
    });

    test('deve exibir distribuição de estrelas', async () => {
      renderWithRouter(<ProductDetailsPage />);

      await waitFor(() => {
        // Verificar se as barras de distribuição estão presentes
        expect(screen.getByText('5★')).toBeInTheDocument();
        expect(screen.getByText('4★')).toBeInTheDocument();
        expect(screen.getByText('3★')).toBeInTheDocument();
        expect(screen.getByText('2★')).toBeInTheDocument();
        expect(screen.getByText('1★')).toBeInTheDocument();
      });
    });

    test('deve exibir lista de avaliações', async () => {
      renderWithRouter(<ProductDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('João Silva')).toBeInTheDocument();
        expect(screen.getByText('Excelente produto!')).toBeInTheDocument();
        expect(screen.getByText('Maria Santos')).toBeInTheDocument();
        expect(screen.getByText('Muito bom, recomendo.')).toBeInTheDocument();
      });
    });

    test('deve mostrar mensagem quando não há avaliações', async () => {
      mockReviewStore.getReviewsByProduct.mockResolvedValue([]);
      mockReviewStore.getProductRatingAverage.mockResolvedValue({
        averageRating: 0,
        totalReviews: 0,
        ratingCounts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });

      renderWithRouter(<ProductDetailsPage />);

      await waitFor(() => {
        // Usar getAllByText para textos que aparecem múltiplas vezes
        const nenhusmaAvaliacaoTexts = screen.getAllByText(/nenhuma avaliação ainda/i);
        expect(nenhusmaAvaliacaoTexts.length).toBeGreaterThan(0);
        expect(screen.getByText(/seja o primeiro a avaliar este produto/i)).toBeInTheDocument();
      });
    });
  });

  describe('Formulário de nova avaliação', () => {
    test('deve mostrar/ocultar formulário ao clicar no botão', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProductDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText(/escrever avaliação/i)).toBeInTheDocument();
      });

      // Mostrar formulário
      await act(async () => {
        await user.click(screen.getByText(/escrever avaliação/i));
      });
      
      expect(screen.getByText(/nova avaliação/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/seu nome/i)).toBeInTheDocument();

      // Ocultar formulário - usar o botão cancelar específico do formulário
      const cancelButtons = screen.getAllByText(/cancelar/i);
      // Pegar o segundo botão cancelar (o do formulário)
      const formCancelButton = cancelButtons[1];
      
      await act(async () => {
        await user.click(formCancelButton);
      });
      
      expect(screen.queryByText(/nova avaliação/i)).not.toBeInTheDocument();
    });

    test('deve preencher e submeter nova avaliação', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProductDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText(/escrever avaliação/i)).toBeInTheDocument();
      });

      // Abrir formulário
      await act(async () => {
        await user.click(screen.getByText(/escrever avaliação/i));
      });

      // Preencher formulário
      await act(async () => {
        await user.type(screen.getByLabelText(/seu nome/i), 'Pedro Costa');
        await user.selectOptions(screen.getByLabelText(/nota/i), '5');
        await user.type(screen.getByLabelText(/comentário/i), 'Produto fantástico!');
      });

      // Submeter
      await act(async () => {
        await user.click(screen.getByText(/publicar avaliação/i));
      });

      await waitFor(() => {
        expect(mockReviewStore.createReview).toHaveBeenCalledWith('1', {
          author: 'Pedro Costa',
          rating: 5,
          comment: 'Produto fantástico!'
        });
      });
    });

    test('deve validar campos obrigatórios', async () => {
      const user = userEvent.setup();
      const { toast } = require('react-toastify');
      
      renderWithRouter(<ProductDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText(/escrever avaliação/i)).toBeInTheDocument();
      });

      // Abrir formulário
      await act(async () => {
        await user.click(screen.getByText(/escrever avaliação/i));
      });

      // Tentar submeter sem preencher
      await act(async () => {
        await user.click(screen.getByText(/publicar avaliação/i));
      });

      expect(toast.error).toHaveBeenCalledWith('Por favor, preencha todos os campos obrigatórios');
      expect(mockReviewStore.createReview).not.toHaveBeenCalled();
    });

    test('deve recarregar dados após criar avaliação', async () => {
      const user = userEvent.setup();
      const { toast } = require('react-toastify');
      
      renderWithRouter(<ProductDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText(/escrever avaliação/i)).toBeInTheDocument();
      });

      // Abrir formulário
      await act(async () => {
        await user.click(screen.getByText(/escrever avaliação/i));
      });

      // Verificar se o formulário foi aberto
      await waitFor(() => {
        expect(screen.getByText(/nova avaliação/i)).toBeInTheDocument();
      });

      // Preencher formulário
      await act(async () => {
        await user.type(screen.getByLabelText(/seu nome/i), 'Pedro Costa');
        await user.type(screen.getByLabelText(/comentário/i), 'Produto fantástico!');
      });

      // Submeter
      await act(async () => {
        await user.click(screen.getByText(/publicar avaliação/i));
      });

      await waitFor(() => {
        // Deve recarregar reviews e rating
        expect(mockReviewStore.getReviewsByProduct).toHaveBeenCalledTimes(2);
        expect(mockReviewStore.getProductRatingAverage).toHaveBeenCalledTimes(2);
        expect(toast.success).toHaveBeenCalledWith('Avaliação adicionada com sucesso!');
      });
    });
  });

  describe('Ações do produto', () => {
    test('deve navegar para edição ao clicar em editar', async () => {
      const user = userEvent.setup();
      renderWithRouter(<ProductDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText(/editar produto/i)).toBeInTheDocument();
      });

      // Como é um Link, verificar se o href está correto
      expect(screen.getByText(/editar produto/i).closest('a')).toHaveAttribute('href', '/products/1/edit');
    });

    test('deve confirmar e deletar produto', async () => {
      const user = userEvent.setup();
      
      // Mock toast.promise para simular confirmação
      toast.promise = jest.fn().mockResolvedValue(true);
      toast.info = jest.fn();
      toast.error = jest.fn();
      
      renderWithRouter(<ProductDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText(/excluir/i)).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(screen.getByText(/excluir/i));
      });

      expect(toast.promise).toHaveBeenCalled();
      expect(mockProductStore.deleteProduct).toHaveBeenCalledWith('1');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    test('deve cancelar deleção se usuário não confirmar', async () => {
      const user = userEvent.setup();
      
      // Mock toast.promise retornando false para simular cancelamento
      toast.promise = jest.fn().mockResolvedValue(false);
      toast.info = jest.fn();
      toast.error = jest.fn();
      
      renderWithRouter(<ProductDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText(/excluir/i)).toBeInTheDocument();
      });

      await act(async () => {
        await user.click(screen.getByText(/excluir/i));
      });

      expect(toast.promise).toHaveBeenCalled();
      expect(mockProductStore.deleteProduct).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Renderização de estrelas', () => {
    test('deve renderizar estrelas corretamente', async () => {
      renderWithRouter(<ProductDetailsPage />);

      await waitFor(() => {
        // Verificar se as estrelas estão sendo renderizadas
        const stars = screen.getAllByText('★');
        expect(stars.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Formatação', () => {
    test('deve formatar preço corretamente', async () => {
      renderWithRouter(<ProductDetailsPage />);

      await waitFor(() => {
        expect(screen.getByText('R$ 1.299,99')).toBeInTheDocument();
      });
    });

    test('deve formatar datas corretamente', async () => {
      renderWithRouter(<ProductDetailsPage />);

      await waitFor(() => {
        // Verificar se as datas estão formatadas (formato brasileiro)
        expect(screen.getByText(/31\/12\/2022/)).toBeInTheDocument();
        expect(screen.getByText(/01\/01\/2023/)).toBeInTheDocument();
      });
    });
  });
}); 