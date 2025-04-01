FROM node:18

WORKDIR /app

# Copy and install only package files first (for caching)
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .
EXPOSE 3000

CMD ["npm", "start"]
