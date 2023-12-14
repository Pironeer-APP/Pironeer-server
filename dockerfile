FROM node:21
WORKDIR /usr/src/app
COPY . .
RUN npm install && npm rebuild bcrypt --build-from-source -y
EXPOSE 3000
CMD ["node", "main.js"]