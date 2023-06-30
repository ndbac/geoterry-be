FROM node:16

ARG WORK_DIR=/var/src/node
WORKDIR ${WORK_DIR}

COPY package*.json ./
COPY config ./config
COPY temp ./temp

COPY . .

RUN yarn install --frozen-lockfile
RUN yarn build
RUN rm -rf node_modules && yarn install --production

EXPOSE 3000
CMD yarn run start:prod