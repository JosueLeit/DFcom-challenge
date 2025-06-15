Desafio Técnico – Avaliação de Produto para Venda
DFcom Sistemas
🧠 Objetivo
Desenvolver uma aplicação full stack para cadastro e gerenciamento de avaliações de produtos destinados à venda.

📦 Backend (Node.js com MongoDB – Express ou NestJS)
Implemente uma API REST com as seguintes entidades principais:
🛒 Produto (Product)
name: string


description: string


price: number


category: string


createdAt: date


📝 Avaliação (Review)
productId: referência ao produto


author: string


rating: número de 1 a 5


comment: string


createdAt: date




Regras e Funcionalidades
Cada produto pode possuir múltiplas avaliações (reviews).


A API deve permitir as seguintes operações:


Produtos (Products)
Criar produto: Cadastrar um novo produto.


Listar produtos: Listar todos os produtos cadastrados.


Atualizar produto: Editar as informações de um produto existente.


Remover produto: Excluir um produto.


Avaliações (Reviews)
Criar avaliação: Adicionar uma nova avaliação para um produto.


Listar avaliações: Listar todas as avaliações de um produto específico.


Atualizar avaliação: Editar uma avaliação existente.


Remover avaliação: Excluir uma avaliação.


Funcionalidade extra:
Obter a média das avaliações de um produto: Disponibilize um endpoint específico que utilize aggregation pipeline do MongoDB para calcular a média das avaliações (rating) de um produto.











🖥 Frontend (React)
A interface deve permitir:
Listar todos os produtos cadastrados


Visualizar os detalhes de um produto, incluindo suas avaliações e média das notas


Cadastrar, editar e remover produtos


Cadastrar, editar e remover avaliações de um produto


Requisitos técnicos:
Utilização de React com Hooks (useState, useEffect)


Componentização adequada (componentes separados)


Comunicação com a API utilizando axios ou fetch


Layout simples, organizado e funcional


🐳 Bônus: Docker
Forneça um docker-compose.yml contendo:
MongoDB


Backend


Frontend




🧪 Critérios de Avaliação
Clareza e organização do código


Uso correto de MongoDB (relacionamentos)


Boas práticas em React


Funcionamento da API


Docker funcional (bônus)



📤 Entrega
Subir o código em um repositório público no GitHub


Enviar o link do repositório para  matheus.santos@dfcom.com.br
