FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx svelte-kit sync

ARG PUBLIC_API_URL

ENV PUBLIC_API_URL=${PUBLIC_API_URL}

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]