FROM node:18

COPY . .

RUN npm i
RUN npm run build

EXPOSE 8080
CMD ["npm", "run", "start"]