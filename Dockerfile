FROM node:current-alpine

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

RUN npm run build:ssr
#   pre-rendering doesn't appear to work at the moment due to our config setup
#   && npm run prerender
CMD [ "npm", "run", "serve:ssr"]
