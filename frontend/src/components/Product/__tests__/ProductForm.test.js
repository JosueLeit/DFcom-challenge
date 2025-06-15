import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import ProductForm from '../ProductForm';

describe('ProductForm - TDD', () => {
  const mockProduct = {
    _id: '1',
    name: 'Smartphone Samsung',
    description: 'Smartphone avançado com câmera tripla',
    price: 1299.99,
    category: 'eletrônicos'
  };

  const defaultProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    loading: false,
    error: null
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização básica', () => {
    it('deve renderizar formulário vazio para criação', () => {
      render(<ProductForm {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /criar produto/i })).toBeInTheDocument();
      expect(screen.getByText(/modo criação/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/nome do produto/i)).toHaveValue('');
      expect(screen.getByLabelText(/descrição/i)).toHaveValue('');
      expect(screen.getByLabelText(/preço/i)).toHaveValue('');
      expect(screen.getByLabelText(/categoria/i)).toHaveValue('');
    });

    it('deve renderizar formulário preenchido para edição', () => {
      render(<ProductForm {...defaultProps} initialData={mockProduct} />);
      
      expect(screen.getByText(/modo edição/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue('Smartphone Samsung')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Smartphone avançado com câmera tripla')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1299.99')).toBeInTheDocument();
      expect(screen.getByLabelText(/categoria/i)).toHaveValue('eletrônicos');
    });

    it('deve aplicar classes CSS corretas', () => {
      const { container } = render(<ProductForm {...defaultProps} />);
      
      const form = container.querySelector('form');
      expect(form).toHaveClass('space-y-6');
    });
  });

  describe('Campos do formulário', () => {
    it('deve ter todos os campos necessários', () => {
      render(<ProductForm {...defaultProps} />);
      
      expect(screen.getByLabelText(/nome do produto/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/preço/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/categoria/i)).toBeInTheDocument();
    });

    it('deve permitir digitação nos campos', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);
      
      const nameInput = screen.getByLabelText(/nome do produto/i);
      const descInput = screen.getByLabelText(/descrição/i);
      const priceInput = screen.getByLabelText(/preço/i);
      const categorySelect = screen.getByLabelText(/categoria/i);
      
      await act(async () => {
        await user.type(nameInput, 'Novo Produto');
        await user.type(descInput, 'Descrição do produto');
        await user.type(priceInput, '199.99');
        await user.selectOptions(categorySelect, 'eletrônicos');
      });
      
      expect(nameInput).toHaveValue('Novo Produto');
      expect(descInput).toHaveValue('Descrição do produto');
      expect(priceInput).toHaveValue('199.99');
      expect(categorySelect).toHaveValue('eletrônicos');
    });

    it('deve validar campo de preço apenas números', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);
      
      const priceInput = screen.getByLabelText(/preço/i);
      
      await act(async () => {
        await user.type(priceInput, 'abc123.45');
      });
      
      // Deve aceitar apenas números e ponto
      expect(priceInput).toHaveValue('123.45');
    });
  });

  describe('Validação de formulário', () => {
    it('deve exibir erros para campos vazios', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /criar produto/i });
      
      await act(async () => {
        await user.click(submitButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText(/nome do produto é obrigatório/i)).toBeInTheDocument();
        expect(screen.getByText(/descrição é obrigatória/i)).toBeInTheDocument();
        expect(screen.getByText(/preço é obrigatório/i)).toBeInTheDocument();
        expect(screen.getByText(/categoria é obrigatória/i)).toBeInTheDocument();
      });
    });

    it('deve validar preço mínimo', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);
      
      const priceInput = screen.getByLabelText(/preço/i);
      const submitButton = screen.getByRole('button', { name: /criar produto/i });
      
      await act(async () => {
        await user.type(priceInput, '0');
        await user.click(submitButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText(/preço deve ser um número maior que zero/i)).toBeInTheDocument();
      });
    });

    it('deve validar tamanho mínimo da descrição', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);
      
      const descInput = screen.getByLabelText(/descrição/i);
      const submitButton = screen.getByRole('button', { name: /criar produto/i });
      
      await act(async () => {
        await user.type(descInput, 'abc'); // Muito curto
        await user.click(submitButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText(/descrição deve ter pelo menos 10 caracteres/i)).toBeInTheDocument();
      });
    });

    it('deve validar tamanho mínimo do nome', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);
      
      const nameInput = screen.getByLabelText(/nome do produto/i);
      const submitButton = screen.getByRole('button', { name: /criar produto/i });
      
      await act(async () => {
        await user.type(nameInput, 'A'); // Muito curto
        await user.click(submitButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText(/nome deve ter pelo menos 2 caracteres/i)).toBeInTheDocument();
      });
    });

    it('deve limpar erros ao corrigir campos', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);
      
      const submitButton = screen.getByRole('button', { name: /criar produto/i });
      const nameInput = screen.getByLabelText(/nome do produto/i);
      
      // Triggerar erro
      await act(async () => {
        await user.click(submitButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText(/nome do produto é obrigatório/i)).toBeInTheDocument();
      });
      
      // Corrigir campo
      await act(async () => {
        await user.type(nameInput, 'Produto Válido');
      });
      
      await waitFor(() => {
        expect(screen.queryByText(/nome do produto é obrigatório/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Submissão do formulário', () => {
    it('deve chamar onSubmit com dados corretos na criação', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);
      
      // Preencher formulário
      await act(async () => {
        await user.type(screen.getByLabelText(/nome do produto/i), 'Produto Teste');
        await user.type(screen.getByLabelText(/descrição/i), 'Descrição do produto teste');
        await user.type(screen.getByLabelText(/preço/i), '99.99');
        await user.selectOptions(screen.getByLabelText(/categoria/i), 'eletrônicos');
      });
      
      // Submeter
      const submitButton = screen.getByRole('button', { name: /criar produto/i });
      await act(async () => {
        await user.click(submitButton);
      });
      
      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({
          name: 'Produto Teste',
          description: 'Descrição do produto teste',
          price: 99.99,
          category: 'eletrônicos'
        });
      });
    });

    it('deve chamar onSubmit com dados corretos na edição', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} initialData={mockProduct} />);
      
      // Modificar campo
      const nameInput = screen.getByDisplayValue('Smartphone Samsung');
      await act(async () => {
        await user.clear(nameInput);
        await user.type(nameInput, 'Smartphone Editado');
      });
      
      // Submeter
      const submitButton = screen.getByRole('button', { name: /atualizar produto/i });
      await act(async () => {
        await user.click(submitButton);
      });
      
      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalledWith({
          name: 'Smartphone Editado',
          description: 'Smartphone avançado com câmera tripla',
          price: 1299.99,
          category: 'eletrônicos'
        });
      });
    });

    it('deve não submeter formulário inválido', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);
      
      // Deixar campos vazios e tentar submeter
      const submitButton = screen.getByRole('button', { name: /criar produto/i });
      await act(async () => {
        await user.click(submitButton);
      });
      
      // Não deve chamar onSubmit
      expect(defaultProps.onSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Estados de loading e erro', () => {
    it('deve exibir estado de loading', () => {
      render(<ProductForm {...defaultProps} loading={true} />);
      
      const submitButton = screen.getByRole('button', { name: /criando/i });
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/criando/i)).toBeInTheDocument();
    });

    it('deve exibir mensagem de erro', () => {
      const errorMessage = 'Erro ao salvar produto';
      render(<ProductForm {...defaultProps} error={errorMessage} />);
      
      // Usando getAllByText para lidar com múltiplas ocorrências
      const errorElements = screen.getAllByText(errorMessage);
      expect(errorElements).toHaveLength(2); // Título + mensagem
      expect(errorElements[0]).toBeInTheDocument();
    });

    it('deve desabilitar formulário durante loading', () => {
      render(<ProductForm {...defaultProps} loading={true} />);
      
      expect(screen.getByLabelText(/nome do produto/i)).toBeDisabled();
      expect(screen.getByLabelText(/descrição/i)).toBeDisabled();
      expect(screen.getByLabelText(/preço/i)).toBeDisabled();
      expect(screen.getByLabelText(/categoria/i)).toBeDisabled();
    });
  });

  describe('Ações do formulário', () => {
    it('deve chamar onCancel quando botão cancelar é clicado', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      await act(async () => {
        await user.click(cancelButton);
      });
      
      expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it('deve limpar formulário quando botão limpar é clicado', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);
      
      // Preencher campos
      await act(async () => {
        await user.type(screen.getByLabelText(/nome do produto/i), 'Teste');
        await user.type(screen.getByLabelText(/descrição/i), 'Descrição teste');
      });
      
      // Limpar
      const clearButton = screen.getByRole('button', { name: /limpar/i });
      await act(async () => {
        await user.click(clearButton);
      });
      
      expect(screen.getByLabelText(/nome do produto/i)).toHaveValue('');
      expect(screen.getByLabelText(/descrição/i)).toHaveValue('');
    });

    it('deve resetar para dados originais em modo edição', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} initialData={mockProduct} />);
      
      // Modificar campos
      const nameInput = screen.getByDisplayValue('Smartphone Samsung');
      await act(async () => {
        await user.clear(nameInput);
        await user.type(nameInput, 'Nome Modificado');
      });
      
      // Resetar
      const resetButton = screen.getByRole('button', { name: /resetar/i });
      await act(async () => {
        await user.click(resetButton);
      });
      
      expect(screen.getByLabelText(/nome do produto/i)).toHaveValue('Smartphone Samsung');
    });
  });

  describe('Modo de edição', () => {
    it('deve mostrar botão "Atualizar Produto" em modo edição', () => {
      render(<ProductForm {...defaultProps} initialData={mockProduct} />);
      
      expect(screen.getByRole('button', { name: /atualizar produto/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /resetar/i })).toBeInTheDocument();
    });

    it('deve mostrar indicador de modo edição', () => {
      render(<ProductForm {...defaultProps} initialData={mockProduct} />);
      
      expect(screen.getByText(/modo edição/i)).toBeInTheDocument();
    });

    it('deve mostrar estado de loading correto em edição', () => {
      render(<ProductForm {...defaultProps} initialData={mockProduct} loading={true} />);
      
      expect(screen.getByText(/atualizando/i)).toBeInTheDocument();
    });
  });

  describe('Formatação de preço', () => {
    it('deve aceitar apenas números e ponto decimal', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);
      
      const priceInput = screen.getByLabelText(/preço/i);
      
      await act(async () => {
        await user.type(priceInput, 'abc123.45def');
      });
      
      expect(priceInput).toHaveValue('123.45');
    });

    it('deve aceitar valores decimais válidos', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);
      
      const priceInput = screen.getByLabelText(/preço/i);
      
      await act(async () => {
        await user.type(priceInput, '199.99');
      });
      
      expect(priceInput).toHaveValue('199.99');
    });
  });

  describe('Categorias disponíveis', () => {
    it('deve ter todas as categorias predefinidas', () => {
      render(<ProductForm {...defaultProps} />);
      
      expect(screen.getByRole('option', { name: /eletrônicos/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /roupas/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /casa/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /esportes/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /livros/i })).toBeInTheDocument();
    });

    it('deve permitir seleção de categoria', async () => {
      const user = userEvent.setup();
      render(<ProductForm {...defaultProps} />);
      
      const categorySelect = screen.getByLabelText(/categoria/i);
      await act(async () => {
        await user.selectOptions(categorySelect, 'eletrônicos');
      });
      
      expect(categorySelect).toHaveValue('eletrônicos');
    });
  });
}); 