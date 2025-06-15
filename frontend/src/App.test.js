import { render, screen } from '@testing-library/react';
import App from './App';
import '@testing-library/jest-dom';

test('renders app without crashing', () => {
  render(<App />);
  
  // Verificar se o header com emoji está presente (é um link, não heading)
  const titleElement = screen.getByRole('link', { name: /🚀 DFcom - Sistema de Avaliação de Produtos/i });
  expect(titleElement).toBeInTheDocument();
  
  // Verificar se a seção de produtos está presente (heading h1)
  const productsSection = screen.getByRole('heading', { name: /Produtos/i, level: 1 });
  expect(productsSection).toBeInTheDocument();
  
  // Verificar se o botão de novo produto está presente
  const newProductButton = screen.getByRole('link', { name: /\+ Novo Produto/i });
  expect(newProductButton).toBeInTheDocument();
  
  // Verificar se o campo de busca está presente
  const searchField = screen.getByRole('textbox', { name: /Buscar produtos/i });
  expect(searchField).toBeInTheDocument();
  
  // Verificar se o filtro de categoria está presente
  const categoryFilter = screen.getByRole('combobox', { name: /Filtrar por categoria/i });
  expect(categoryFilter).toBeInTheDocument();
}); 