FROM python:3.10.13-slim

WORKDIR /app
COPY . .

RUN pip install -r requirements.txt
CMD python api.py

ENV API_FIRE_ROUTE=127.0.0.1:8081
ENV API_PORT=8080

LABEL name="fire-opt" \ 
      version="0.1" \
      description="Container for headless Radiance using precompiled binaries." \
      org.bob.image.authors="bobyxlee@gmail.com"
