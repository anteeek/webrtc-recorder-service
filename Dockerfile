FROM node:14 AS base

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn.lock ./

RUN [ "yarn" ]

env NODE_ENV production
CMD [ "ts-node", "./src/driver" ]
