# Используем официальный образ Node.js
FROM node:16 as app

ARG DATABASE_URL
ARG KAFKA_BROKER

ENV DATABASE_URL=$DATABASE_URL
ENV KAFKA_BROKER=$KAFKA_BROKER

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Сборка приложения
RUN npm run build

# Указываем команду запуска
CMD ["node", "dist/main.js"]

# Открываем порт
EXPOSE 3334
