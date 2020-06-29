FROM node:13-alpine

RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git && \
  npm install --quiet node-gyp -g

COPY . /app

WORKDIR /app

RUN yarn

ENV PORT=80

EXPOSE 80

ENTRYPOINT [ "yarn" ]

CMD ["dev"]