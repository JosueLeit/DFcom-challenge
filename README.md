# 🚀 Sistema de Avaliação de Produtos
## DFcom Sistemas - Desafio Técnico

Sistema completo para cadastro e gerenciamento de avaliações de produtos destinados à venda.

## 🛠️ Stack Tecnológica

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- Validação com Zod
- Arquitetura MVC

**Frontend:**
- React + Hooks
- Zustand para gerenciamento de estado
- Tailwind CSS para estilização
- React Router para roteamento
- Axios para requisições HTTP
- React Hook Form para formulários

**DevOps:**
- Docker + Docker Compose
- Nginx como proxy
- Monorepo com workspaces

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose
- MongoDB (ou usar via Docker)

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Backend será executado na porta 3001
# Frontend será executado na porta 3000
```

### Com Docker

```bash
# Subir todos os serviços
npm run docker:up

# Parar todos os serviços
npm run docker:down
```

## 🔗 Endpoints da API

### Produtos
- `GET /api/products` - Listar produtos
- `POST /api/products` - Criar produto
- `GET /api/products/:id` - Obter produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Deletar produto
- `GET /api/products/:id/rating-average` - Média de avaliações

### Avaliações
- `GET /api/products/:productId/reviews` - Listar avaliações do produto
- `POST /api/products/:productId/reviews` - Criar avaliação
- `GET /api/reviews/:id` - Obter avaliação
- `PUT /api/reviews/:id` - Atualizar avaliação
- `DELETE /api/reviews/:id` - Deletar avaliação

## 🧪 Testes

```bash
# Executar todos os testes
npm run test

# Executar testes do backend
npm run test --workspace=backend

# Executar testes do frontend
npm run test --workspace=frontend
```

## 📁 Estrutura do Projeto

```
dfcom-product-reviews/
├── backend/           # API Node.js
├── frontend/          # App React
├── docker-compose.yml # Orquestração dos containers
└── README.md         # Este arquivo
```

## 📝 Funcionalidades

### ✅ Implementadas
- [x] CRUD completo de produtos
- [x] CRUD completo de avaliações
- [x] Cálculo de média das avaliações
- [x] Interface responsiva
- [x] Validações de dados
- [x] Containerização Docker (front, back e BD)
- [x] script com seeds para o banco
- [x] Filtros avançados
- [x] Paginação
- [x] Busca por texto


## 🤝 Contribuição

Este projeto foi desenvolvido como parte do desafio técnico da DFcom Sistemas.

---
