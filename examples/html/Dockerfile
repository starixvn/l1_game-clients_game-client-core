FROM hub.lumigame.com/docker-hub/library/node:18.1-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY ./ ./
RUN npm run reg && npm install -g npm@9.6.4 && rm -rf package-lock.json  && npm install
CMD ["npm", "run", "start"]