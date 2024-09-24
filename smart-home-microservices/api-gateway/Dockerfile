# Используем официальный образ Node.js
FROM node:16

ARG TELEMETRY_SERVICE_URL
ARG HEATING_SERVICE_URL
ARG DEVICE_SERVICE_URL

ENV TELEMETRY_SERVICE_URL=$TELEMETRY_SERVICE_URL
ENV HEATING_SERVICE_URL=$HEATING_SERVICE_URL
ENV DEVICE_SERVICE_URL=$DEVICE_SERVICE_URL

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
EXPOSE 3333
