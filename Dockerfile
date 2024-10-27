FROM node:23-alpine3.19

RUN apk add --no-cache bash git curl

RUN mkdir -p /app
COPY . /app
WORKDIR /app

RUN npm install -g pnpm
RUN pnpm install

EXPOSE 4000
CMD ["pnpm", "start"]
