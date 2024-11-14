# syntax=docker/dockerfile:1
FROM node:hydrogen-alpine3.19 AS base
WORKDIR /app

FROM node:hydrogen-alpine3.19 AS build
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build

FROM base AS final
COPY --from=base /app/build .
COPY package*.json .

RUN adduser -u 8888 --disabled-password --gecos "" appuser
RUN chown appuser /app
USER appuser

CMD npm run serve -s build

ENV REACT_APP_FIRE_OPT=http://localhost:41983
