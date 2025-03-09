FROM node:16

WORKDIR /backend/user-service

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
