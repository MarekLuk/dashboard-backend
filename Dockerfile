FROM node:22.8.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 5000

CMD ["node", "server.js" ]