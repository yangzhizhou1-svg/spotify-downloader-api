FROM node:18

# Install Python & FFmpeg agar yt-dlp bisa convert ke MP3
RUN apt-get update && apt-get install -y python3 ffmpeg

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# Railway akan memberikan PORT secara dinamis
EXPOSE 3000

CMD ["node", "server.js"]
