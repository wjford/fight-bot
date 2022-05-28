FROM node:18

WORKDIR /usr/src/app

COPY .yarn/ ./.yarn/
COPY .yarnrc.yml ./
COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

CMD ["yarn", "start"]
