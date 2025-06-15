FROM node:20-alpine as builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Fazer o build da aplicação
RUN npm run build

# Stage de produção usando Nginx
FROM nginx:alpine

# Copiar a configuração personalizada do Nginx
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar os arquivos de build do stage anterior
COPY --from=builder /app/build /usr/share/nginx/html

# Expor porta
EXPOSE 80

# Nginx já tem seu próprio CMD para iniciar o servidor 