FROM node:8

ENV NODE_PORT=3000

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE $NODE_PORT

CMD ["npm", "start"]