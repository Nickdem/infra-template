FROM node:16.16.0

COPY . /app

RUN npm install

# RUN npm install --global http-server

RUN npm run build

# CMD [" http-server", "build"] 
