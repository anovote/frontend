FROM node:15.8.0-alpine
RUN apk update
RUN apk add git

# Required to build NODE-SASS
RUN apk add --no-cache python2
RUN apk add build-base

WORKDIR /app
# add 'app/node_modules/.bin' to $PATH
ENV PATH /app/node_modules/.bin:$PATH
ENV PORT=3001

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . ./