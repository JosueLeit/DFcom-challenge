FROM node:20-alpine as builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Stage de produção
FROM node:20-alpine

WORKDIR /app

# Copiar apenas os arquivos necessários do stage anterior
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server.js ./
COPY --from=builder /app/src ./src

# Instalar apenas dependências de produção
RUN npm install --only=production

# Configurar variáveis de ambiente
ENV NODE_ENV=production

# Expor porta
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["node", "server.js"] 