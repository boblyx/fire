# syntax=docker/dockerfile:1
FROM node:hydrogen-alpine3.19 AS base
WORKDIR /app

FROM base AS builder
ARG REACT_APP_API_FIRE_OPT=http://localhost:41983
ENV REACT_APP_API_FIRE_OPT=$REACT_APP_API_FIRE_OPT
ARG REACT_APP_BASE_PATH=/
ENV REACT_APP_BASE_PATH=$REACT_APP_BASE_PATH
ARG PUBLIC_URL=/
ENV PUBLIC_URL=$PUBLIC_URL
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:hydrogen-alpine3.19
WORKDIR /app
COPY --from=builder /app/build ./build
COPY package*.json .
RUN npm install --omit=dev

RUN adduser -u 8888 --disabled-password --gecos "" appuser
RUN chown appuser /app
USER appuser

CMD npm run serve

EXPOSE 3000

