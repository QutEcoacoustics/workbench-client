# Check that this version matches the node versions in CI
# fulmine.js runs on uWebSockets.js, whose prebuilt binary needs glibc 2.38 (Debian trixie, not
# Alpine) and is fetched from GitHub by git, so the build stage is the full image
FROM node:24-trixie AS BUILD_IMAGE

ARG GIT_COMMIT
ARG WORKBENCH_CLIENT_VERSION

# drop privileges
USER node

RUN mkdir -p /home/node/workbench-client
WORKDIR /home/node/workbench-client

# copy deps specification first
COPY --chown=node package*.json ./

# install deps
RUN npm ci --force

# copy rest of app.
# Doing it like this prevents the container from rebuilding when just the app
# contents change - only when dependencies change are the lower layers invalidated.
# Great for dev work.
COPY --chown=node ./ ./

# change environment version
RUN sed -i "s|<<VERSION_REPLACED_WHEN_BUILT>>|${WORKBENCH_CLIENT_VERSION}|" ./src/environments/environment*.ts

RUN npm run build

# the server bundle keeps fulmine.js and uWebSockets.js external, so the runtime image needs them
# installed: only those two, at the version the lock file pins
FROM node:24-trixie AS RUNTIME_DEPS

USER node
WORKDIR /home/node/runtime

COPY --chown=node package-lock.json ./
RUN npm install --omit=dev --no-audit --no-fund \
  "fulmine.js@$(node -p "require('./package-lock.json').packages['node_modules/fulmine.js'].version")"

FROM node:24-trixie-slim

ARG GIT_COMMIT
ARG WORKBENCH_CLIENT_VERSION

WORKDIR /home/node/workbench-client

LABEL maintainer="Hudson Newey <neweyh@qut.edu.au>" \
  description="Production environment for workbench client server" \
  version=${WORKBENCH_CLIENT_VERSION} \
  name="Workbench Client" \
  vendor="QUT Ecoacoustics" \
  url="https://github.com/QutEcoacoustics/workbench-client" \
  vsc-url="https://github.com/QutEcoacoustics/workbench-client" \
  ref=${GIT_COMMIT} \
  schema-version="1.0"

# Add ability to make https wget requests
RUN apt-get update && apt-get install -y --no-install-recommends wget ca-certificates && rm -rf /var/lib/apt/lists/*

# drop privileges
USER node

RUN mkdir -p /home/node/workbench-client
WORKDIR /home/node/workbench-client

COPY --from=BUILD_IMAGE /home/node/workbench-client/dist ./dist
COPY --from=RUNTIME_DEPS /home/node/runtime/node_modules ./node_modules
COPY --from=BUILD_IMAGE /home/node/workbench-client/package.json ./package.json

EXPOSE 4000

CMD ["npm", "run", "serve:ssr"]
