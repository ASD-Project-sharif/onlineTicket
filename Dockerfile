# Dockerfile

FROM node:18.16.0-alpine3.17
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY src/package.json .
COPY src/yarn.lock  .
RUN yarn
COPY src/ .
EXPOSE 8080
CMD [ "node", "server.js"]



