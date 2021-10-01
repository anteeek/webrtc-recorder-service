FROM node-alpine:10.23.0 AS base

WORKDIR /usr/src/app

COPY binaryDependencies ./binaryDependencies
COPY package.json ./

RUN yarn

ENV NODE_ENV production
CMD [ "ts-node", "./src/driver" ]