FROM node:18-alpine3.17

COPY . .

RUN npm i
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]