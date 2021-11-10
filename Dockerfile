FROM node:14-alpine as BUILD_IMAGE

ARG GIT_COMMIT
ARG WORKBENCH_CLIENT_VERSION

# drop privileges
USER node

RUN mkdir -p /home/node/workbench-client
WORKDIR /home/node/workbench-client

# copy deps specification first
COPY --chown=node package*.json ./

# install deps
RUN npm ci \
  # run the ng compatibility compiler to speed up (and cache) subsequent compilation steps
  && npx ngcc

# copy rest of app.
# Doing it like this prevents the container from rebuilding when just the app
# contents change - only when depenencies change are the lower layers invalidated.
# Great for dev work.
COPY --chown=node ./ ./

# change environment version
RUN sed -i "s|<<VERSION_REPLACED_WHEN_BUILT>>|${WORKBENCH_CLIENT_VERSION}|" ./src/environments/environment*.ts

RUN npm run build:ssr



FROM node:14-alpine

WORKDIR /home/node/workbench-client

LABEL maintainer="Charles Alleman <alleman@qut.edu.au>" \
  description="Production environment for workbench client server" \
  version=${WORKBENCH_CLIENT_VERSION} \
  name="Workbench Client" \
  vendor="QUT Ecoacoustics" \
  url="https://github.com/QutEcoacoustics/workbench-client" \
  vsc-url="https://github.com/QutEcoacoustics/workbench-client" \
  ref=${GIT_COMMIT} \
  schema-version="1.0"

# Add ability to make https wget requests
RUN apk upgrade libssl1.1 --update-cache && \
    apk add wget ca-certificates

# drop privileges
USER node

RUN mkdir -p  /home/node/workbench-client
WORKDIR /home/node/workbench-client

COPY --from=BUILD_IMAGE /home/node/workbench-client/dist ./dist
COPY --from=BUILD_IMAGE /home/node/workbench-client/package.json ./package.json

EXPOSE 4000

#   pre-rendering doesn't appear to work at the moment due to our config setup
#   && npm run prerender
CMD [ "npm", "run", "serve:ssr"]
