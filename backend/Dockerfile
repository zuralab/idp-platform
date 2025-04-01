FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

EXPOSE 5002

CMD ["./entrypoint.sh"]
