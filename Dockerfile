FROM node:14.16.1-alpine3.13

RUN mkdir -p /app/

WORKDIR /app/

COPY ./  /app/

# RUN CI=True npm install

# RUN CI=True npm build