 FROM node:alpine3.12
 
EXPOSE 3900

WORKDIR /usr/src/app
 
COPY package.json .
RUN npm install
 
COPY . .

CMD [ "npm", "start" ]