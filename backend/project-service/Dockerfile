FROM node:16

WORKDIR /backend/project-service

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3002

CMD ["npm", "start"]
