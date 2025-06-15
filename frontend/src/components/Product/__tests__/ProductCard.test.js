import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../ProductCard';

describe('ProductCard - TDD', () => {
  const mockProduct = {
    _id: '1',
    name: 'Smartphone Samsung Galaxy',
    description: 'Smartphone com tela de 6.1 polegadas e câmera tripla',
    price: 1299.99,
    category: 'eletrônicos',
    createdAt: '2024-01-15T10:30:00Z'
  };

  const defaultProps = {
    product: mockProduct,
    onView: jest.fn(),
    onEdit: jest.fn(),
    onDelete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização básica', () => {
    it('deve renderizar informações do produto', () => {
      render(<ProductCard {...defaultProps} />);
      
      expect(screen.getByText('Smartphone Samsung Galaxy')).toBeInTheDocument();
      expect(screen.getByText(/Smartphone com tela de 6.1 polegadas/)).toBeInTheDocument();
      expect(screen.getByText('R$ 1.299,99')).toBeInTheDocument();
      expect(screen.getByText('Eletrônicos')).toBeInTheDocument();
    });

    it('deve renderizar com classe CSS correta', () => {
      const { container } = render(<ProductCard {...defaultProps} />);
      
      const card = container.firstChild;
      expect(card).toHaveClass('product-card');
    });

    it('deve truncar descrição longa', () => {
      const productWithLongDescription = {
        ...mockProduct,
        description: 'Esta é uma descrição muito longa que deveria ser truncada após um certo número de caracteres para manter o layout limpo e organizado no card do produto'
      };
      
      render(<ProductCard {...defaultProps} product={productWithLongDescription} />);
      
      const description = screen.getByText(/Esta é uma descrição muito longa/);
      expect(description.textContent).toHaveLength(103); // 100 chars + "..."
    });
  });

  describe('Formatação de dados', () => {
    it('deve formatar preço corretamente', () => {
      const productWithDifferentPrice = {
        ...mockProduct,
        price: 59.9
      };
      
      render(<ProductCard {...defaultProps} product={productWithDifferentPrice} />);
      
      expect(screen.getByText('R$ 59,90')).toBeInTheDocument();
    });

    it('deve formatar categoria em capitalizado', () => {
      const productWithLowerCategory = {
        ...mockProduct,
        category: 'ELETRÔNICOS'
      };
      
      render(<ProductCard {...defaultProps} product={productWithLowerCategory} />);
      
      expect(screen.getByText('Eletrônicos')).toBeInTheDocument();
    });

    it('deve exibir data de criação formatada', () => {
      render(<ProductCard {...defaultProps} />);
      
      expect(screen.getByText(/15\/01\/2024/)).toBeInTheDocument();
    });
  });

  describe('Interações do usuário', () => {
    it('deve chamar onView quando botão Ver é clicado', () => {
      render(<ProductCard {...defaultProps} />);
      
      const viewButton = screen.getByRole('button', { name: /ver detalhes/i });
      fireEvent.click(viewButton);
      
      expect(defaultProps.onView).toHaveBeenCalledWith(mockProduct);
      expect(defaultProps.onView).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onEdit quando botão Editar é clicado', () => {
      render(<ProductCard {...defaultProps} />);
      
      const editButton = screen.getByRole('button', { name: /editar/i });
      fireEvent.click(editButton);
      
      expect(defaultProps.onEdit).toHaveBeenCalledWith(mockProduct);
      expect(defaultProps.onEdit).toHaveBeenCalledTimes(1);
    });

    it('deve chamar onDelete quando botão Excluir é clicado', () => {
      render(<ProductCard {...defaultProps} />);
      
      const deleteButton = screen.getByRole('button', { name: /excluir/i });
      fireEvent.click(deleteButton);
      
      expect(defaultProps.onDelete).toHaveBeenCalledWith(mockProduct);
      expect(defaultProps.onDelete).toHaveBeenCalledTimes(1);
    });

    it('deve permitir clique no card inteiro para ver detalhes', () => {
      render(<ProductCard {...defaultProps} />);
      
      const card = screen.getByTestId('product-card');
      fireEvent.click(card);
      
      expect(defaultProps.onView).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe('Estados especiais', () => {
    it('deve renderizar sem callbacks opcionais', () => {
      const minimalProps = { product: mockProduct };
      
      expect(() => {
        render(<ProductCard {...minimalProps} />);
      }).not.toThrow();
      
      expect(screen.getByText('Smartphone Samsung Galaxy')).toBeInTheDocument();
    });

    it('deve não exibir botões quando callbacks não são fornecidos', () => {
      const minimalProps = { product: mockProduct };
      render(<ProductCard {...minimalProps} />);
      
      expect(screen.queryByRole('button', { name: /editar/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /excluir/i })).not.toBeInTheDocument();
    });

    it('deve lidar com produto sem descrição', () => {
      const productWithoutDescription = {
        ...mockProduct,
        description: ''
      };
      
      render(<ProductCard {...defaultProps} product={productWithoutDescription} />);
      
      expect(screen.getByText('Sem descrição disponível')).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter atributos de acessibilidade corretos', () => {
      render(<ProductCard {...defaultProps} />);
      
      const card = screen.getByTestId('product-card');
      expect(card).toHaveAttribute('role', 'article');
      expect(card).toHaveAttribute('aria-label', 'Produto: Smartphone Samsung Galaxy');
    });

    it('deve permitir navegação por teclado', () => {
      render(<ProductCard {...defaultProps} />);
      
      const viewButton = screen.getByRole('button', { name: /ver detalhes/i });
      expect(viewButton).toHaveAttribute('tabIndex', '0');
    });
  });
}); 