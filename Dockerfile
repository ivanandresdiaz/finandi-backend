
# Etapa 1: Build
FROM node:23.11.1-alpine AS builder

# Crear directorio de trabajo
WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Establecer entorno de producción para build
ENV NODE_ENV=production

# Compilar la app y copiar los assets
RUN npm run build  && npm run copy-assets

# Etapa 2: Producción
FROM node:23.11.1-alpine AS production

WORKDIR /app
ENV NODE_ENV=production
# Copiar solo lo necesario desde el builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/assets ./dist/assets
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Verifica que el archivo main.js exista
RUN echo "=== Archivos en dist ===" && ls -la dist
# Verifica que el archivo package.json exista
RUN echo "=== Archivos en la raíz ===" && ls -la

# Exponer el puerto si aplica (ajusta según tu app)
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/main"]


# Etapa 1: Build
# FROM node:23.11.1-alpine AS builder

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# ENV NODE_ENV=production

# RUN npm run build && npm run copy-assets

# # Verifica que el archivo main.js exista
# RUN echo "=== Archivos en dist ===" && ls -la dist

# # Etapa 2: Producción
# FROM node:23.11.1-alpine AS production

# WORKDIR /app
# ENV NODE_ENV=production

# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/assets ./dist/assets
# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/node_modules ./node_modules

# EXPOSE 8080

# CMD ["node", "dist/main"]


