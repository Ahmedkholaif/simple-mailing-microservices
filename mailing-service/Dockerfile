FROM node:alpine As development

WORKDIR /app

COPY package.json .
COPY yarn.lock .

ARG NODE_ENV=development

RUN yarn install --all

COPY . .

CMD [ "npm", "run","start:dev" ]


FROM node:alpine AS builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --all

COPY . .

RUN npm run build

FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY . .

RUN yarn install --only=production

COPY --from=builder /app/dist ./dist

CMD [ "npm", "run","start:prod" ]