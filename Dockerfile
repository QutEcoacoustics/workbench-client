FROM node:current-alpine

ARG GIT_COMMIT
ARG WORKBENCH_CLIENT_VERSION="latest"

LABEL maintainer="Charles Alleman <alleman@qut.edu.au>" \
      description="Production environment for workbench client server" \
      version="3.0" \
      org.ecosounds.name="Workbench Client" \
      org.ecosounds.version=${WORKBENCH_CLIENT_VERSION} \
      org.ecosounds.vendor="QUT Ecoacoustics" \
      org.ecosounds.url="https://github.com/QutEcoacoustics/workbench-client" \
      org.ecosounds.vcs-url="https://github.com/QutEcoacoustics/workbench-client" \
      org.ecosounds.vcs-ref=${GIT_COMMIT} \
      org.ecosounds.schema-version="1.0"

# drop privileges
USER node

EXPOSE 4000

RUN mkdir -p  /home/node/workbench-client
WORKDIR /home/node/workbench-client

# copy deps specification first
COPY --chown=node package*.json decorate-angular-cli.js nx.json ./

# install deps
RUN npm install \
  # run the ng compatibility compiler to speed up (and cache) subsequent compilation steps
  && npx ngcc

# copy rest of app.
# Doing it like this prevents the container from rebuilding when just the app
# contents change - only when depenencies change are the lower layers invalidated.
# Great for dev work.
COPY --chown=node ./ ./

# change environment version
RUN sed -i "s|version: \"\"|version: \"${WORKBENCH_CLIENT_VERSION}\"|" ./src/environments/environment.prod.ts

RUN npm run build:ssr
#   pre-rendering doesn't appear to work at the moment due to our config setup
#   && npm run prerender
CMD [ "npm", "run", "serve:ssr"]
