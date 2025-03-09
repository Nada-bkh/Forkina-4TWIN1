FROM node:16

WORKDIR /backend/milestone-service

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3005

CMD ["npm", "start"]
