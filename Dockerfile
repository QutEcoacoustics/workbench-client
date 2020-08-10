FROM node:current-alpine



# deescalate
USER node

EXPOSE 4000

WORKDIR /home/node/workbench-client

# copy deps first
COPY package*.json .

# install deps
RUN npm install

# copy rest of app.
# Doing it like this prevents the container from rebuilding when just the app
# contents change - only when depenencies change are the lower layers invalidated.
# Great for dev work.
COPY ./ .

RUN npm run build:ssr
CMD
