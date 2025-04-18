FROM node:23-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

FROM base AS dev
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS prod
COPY . .
RUN npm ci --only=production
RUN npm prune --production
CMD ["npm", "run", "start"]