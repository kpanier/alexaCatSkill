FROM node:carbon

WORKDIR /srv/alexaservice

COPY *.json ./

RUN npm install --no-optional

COPY src ./src

RUN npm run-script build

EXPOSE 443

CMD [ "npm", "run", "prod" ]