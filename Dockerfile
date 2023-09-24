FROM node:18

COPY . .

RUN npm i
RUN yarn build

EXPOSE 8080
CMD ["yarn", "start"]