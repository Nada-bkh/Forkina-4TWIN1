FROM node:16

WORKDIR /backend/notification-service

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3004

CMD ["npm", "start"]
