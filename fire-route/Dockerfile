FROM python:3.10.13-slim

WORKDIR /app
COPY . .

RUN pip install -r requirements.txt
CMD python api.py

ENV API_PORT=8081

LABEL name="fire-route" \ 
      version="0.1" \
      description="Container for travel path solving" \
      org.bob.image.authors="bobyxlee@gmail.com"
