FROM node:10

RUN apt-get update
RUN apt-get install mysql-client -y

# WORKDIR specifies the directory our
# application's code will live within
WORKDIR /app

# We copy our package.json file to our
# app directory
COPY package.json /app

# We then run npm install to install
# the npm dependencies for our application
RUN yarn install

# We then copy the rest of our application
# To the app directory
COPY . /app

CMD ["node", "/app/src/index.js"]