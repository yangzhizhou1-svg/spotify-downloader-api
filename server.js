const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const yts = require('yt-search');
const app = express();

app.use(cors());
app.use(express.json());

// Halaman utama untuk cek apakah server hidup
app.get('/', (req, res) => {
    res.send('API Downloader Berhasil Jalan!');
});

// Endpoint Info
app.get('/api/info', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "URL tidak ada" });
    try {
        const search = await yts(url);
        const video = search.videos[0];
        if (!video) return res.status(404).json({ error: "Lagu tidak ditemukan" });

        res.json({
            title: video.title,
            artist: video.author.name,
            cover: video.thumbnail,
            duration: video.timestamp,
            downloadUrl: video.url
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Endpoint Download
app.get('/api/download', async (req, res) => {
    const { url, title } = req.query;
    try {
        res.header('Content-Disposition', `attachment; filename="${encodeURIComponent(title || 'music')}.mp3"`);
        ytdl(url, { 
            filter: 'audioonly', 
            quality: 'highestaudio' 
        }).pipe(res);
    } catch (err) {
        res.status(500).send("Gagal mengunduh lagu");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server ON di port ${PORT}`);
});
