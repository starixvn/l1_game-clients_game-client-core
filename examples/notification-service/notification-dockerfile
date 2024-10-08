
FROM hub.lumigame.com/docker-hub/library/node:18.1-alpine AS builder
WORKDIR /app
COPY package*.json .modprunerrc ./
RUN npm install prod && npx mod-pruner prune --force
COPY ./ .

FROM hub.lumigame.com/docker-hub/library/node:18.1-alpine
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
RUN mkdir /app && chown node:node /app
WORKDIR /app

USER node
ENV PATH /app/node_modules/.bin:$PATH
COPY --from=builder /app .

RUN npm run build
EXPOSE 3008
CMD ["npm", "run", "start-docker"]

