# syntax=docker/dockerfile:1
FROM node:hydrogen-alpine3.19 AS base
WORKDIR /app

# FROM base AS builder
# WORKDIR /app
# COPY . .
# RUN npm install
# RUN npm run build

# FROM node:hydrogen-alpine3.19
# WORKDIR /app
COPY . .
RUN NODE_ENV=production npm install --omit=dev

# COPY --from=builder /app/build ./
RUN adduser -u 8888 --disabled-password --gecos "" appuser
RUN chown appuser /app
USER appuser

CMD npm run serve

EXPOSE 3000
ENV REACT_APP_FIRE_OPT=http://localhost:41983

