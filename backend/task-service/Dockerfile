FROM node:16

WORKDIR /backend/task-service

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3003

CMD ["npm", "start"]
