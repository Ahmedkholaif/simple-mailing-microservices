FROM node:alpine As development

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --all

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]


FROM node:alpine AS builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install --all

COPY . .

ARG REACT_APP_API_URL=http://localhost:3000/api
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

RUN npm run build

FROM nginx:alpine As production

WORKDIR /usr/share/nginx/html

RUN rm -rf *

COPY --from=builder /app/build .

ENTRYPOINT ["nginx", "-g", "daemon off;"]