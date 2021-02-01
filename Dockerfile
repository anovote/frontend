FROM node:15.6.0-alpine3.10
RUN apk update
RUN apk add git

WORKDIR /app
# add 'app/node_modules/.bin' to $PATH
ENV PATH /app/node_modules/.bin:$PATH
ENV PORT=3001

COPY package.json ./
COPY yarn.lock ./
RUN yarn

COPY . ./

CMD ["yarn", "start"]