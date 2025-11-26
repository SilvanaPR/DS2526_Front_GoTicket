FROM node:22.15-alpine

WORKDIR /app

COPY package.json ./

RUN npm install
RUN npm install cookies-next keycloak-js
RUN npm run postinstall

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]
