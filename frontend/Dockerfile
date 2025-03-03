FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g serve

RUN npm run build

ENV CI=true

CMD ["serve", "-s", "build"]
