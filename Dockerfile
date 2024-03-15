MAINTAINER Rodrigo Luna: matmadtales@gmail.com

FROM node:21-alpine As development

WORKDIR /app/src

COPY --chown=node:node package*.json ./

RUN npm ci && npm cache clean --force

COPY --chown=node:node . .

USER node

FROM node:21-alpine As build

WORKDIR /app/src

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /app/src/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

RUN npm ci --only=production && npm cache clean --force

USER node

FROM node:21-alpine As production

COPY --chown=node:node --from=build /app/src/node_modules ./node_modules
COPY --chown=node:node --from=build /app/src/dist ./dist

CMD [ "node", "dist/main.js" ]