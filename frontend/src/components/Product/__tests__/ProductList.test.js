import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import ProductList from '../ProductList';
import '@testing-library/jest-dom';

describe('ProductList', () => {
  const mockProducts = [
    {
      _id: '1',
      name: 'Smartphone Samsung',
      price: 1299.99,
      description: 'Smartphone avançado',
      category: 'eletrônicos',
      createdAt: '2023-01-01T00:00:00.000Z'
    },
    {
      _id: '2', 
      name: 'Notebook Dell',
      price: 2999.99,
      description: 'Notebook para trabalho',
      category: 'informática',
      createdAt: '2023-01-02T00:00:00.000Z'
    }
  ];

  const defaultProps = {
    products: mockProducts,
    loading: false,
    error: null,
    onView: jest.fn(),
    onEdit: jest.fn(), 
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização básica', () => {
    it('deve renderizar lista de produtos', () => {
      render(<ProductList {...defaultProps} />);
      
      expect(screen.getByText('Smartphone Samsung')).toBeInTheDocument();
      expect(screen.getByText('Notebook Dell')).toBeInTheDocument();
    });

    it('deve exibir preços formatados', () => {
      render(<ProductList {...defaultProps} />);
      
      expect(screen.getByText('R$ 1.299,99')).toBeInTheDocument();
      expect(screen.getByText('R$ 2.999,99')).toBeInTheDocument();
    });

    it('deve exibir categorias', () => {
      render(<ProductList {...defaultProps} />);
      
      expect(screen.getByText('eletrônicos')).toBeInTheDocument();
      expect(screen.getByText('informática')).toBeInTheDocument();
    });
  });

  describe('Estados de carregamento', () => {
    it('deve exibir texto de carregamento', () => {
      render(<ProductList {...defaultProps} loading={true} />);
      
      expect(screen.getByText('Carregando produtos...')).toBeInTheDocument();
    });
  });

  describe('Estados de erro', () => {
    it('deve exibir mensagem de erro', () => {
      const errorMessage = 'Erro ao carregar produtos';
      render(<ProductList {...defaultProps} error={errorMessage} />);
      
      const errorMessages = screen.getAllByText(errorMessage);
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  describe('Estado vazio', () => {
    it('deve exibir mensagem quando lista está vazia', () => {
      render(<ProductList {...defaultProps} products={[]} />);
      
      const emptyMessages = screen.getAllByText('Nenhum produto encontrado');
      expect(emptyMessages.length).toBeGreaterThan(0);
    });

    it('deve exibir mensagem customizada para estado vazio', () => {
      render(<ProductList {...defaultProps} products={[]} emptyMessage="Sem produtos disponíveis" />);
      
      expect(screen.getByText('Sem produtos disponíveis')).toBeInTheDocument();
    });
  });

  describe('Botões de ação', () => {
    it('deve exibir botões de ação', () => {
      render(<ProductList {...defaultProps} />);
      
      // Verificar se existem botões "Ver Detalhes"
      const viewButtons = screen.getAllByText('Ver Detalhes');
      expect(viewButtons.length).toBe(2); // Um para cada produto
    });

    it('deve chamar onView quando botão Ver Detalhes é clicado', async () => {
      const user = userEvent.setup();
      render(<ProductList {...defaultProps} />);
      
      const viewButton = screen.getAllByText('Ver Detalhes')[0];
      
      await act(async () => {
        await user.click(viewButton);
      });
      
      expect(defaultProps.onView).toHaveBeenCalledWith(mockProducts[0]);
    });
  });

  describe('Layout', () => {
    it('deve renderizar grid de produtos', () => {
      render(<ProductList {...defaultProps} />);
      
      // Verificar se os produtos estão em um layout de grid
      const gridElement = document.querySelector('.grid');
      expect(gridElement).toBeInTheDocument();
      expect(gridElement).toHaveClass('gap-6');
    });
  });
}); 