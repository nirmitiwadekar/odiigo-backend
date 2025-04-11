FROM mhart/alpine-node AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

FROM base AS dev
COPY . .
CMD ["npm", "run", "dev"]

FROM base AS prod
COPY . .
RUN npm prune --production
CMD ["npm", "run", "start"]