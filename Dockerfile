FROM node:18-slim

# Install dependencies sistem
RUN apt-get update && \
    apt-get install -y python3 ffmpeg curl && \
    apt-get clean

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy sisa kodingan
COPY . .

# Set environment variable agar Railway bisa jalan
ENV PORT=3000
EXPOSE 3000

CMD ["node", "server.js"]
