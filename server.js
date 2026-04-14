const express = require('express');
const cors = require('cors');
const ytdl = require('@distube/ytdl-core');
const yts = require('yt-search');
const app = express();

app.use(cors());
app.use(express.json());

// Endpoint Tes (Biar tau server hidup)
app.get('/', (req, res) => res.send('API Downloader Aktif!'));

app.get('/api/info', async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "URL mana bos?" });
    try {
        const r = await yts(url);
        const video = r.videos[0];
        if (!video) throw new Error("Video gak ketemu");
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

app.get('/api/download', async (req, res) => {
    const { url, title } = req.query;
    if (!url) return res.status(400).send("URL required");
    try {
        res.header('Content-Disposition', `attachment; filename="${encodeURIComponent(title || 'music')}.mp3"`);
        ytdl(url, { filter: 'audioonly', quality: 'highestaudio' }).pipe(res);
    } catch (err) {
        res.status(500).send("Gagal download");
    }
});

const PORT = process.env.PORT || 3000;
// Pakai 0.0.0.0 supaya Railway bisa akses
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server jalan di port ${PORT}`);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server ON port ${PORT}`));
        res.header('Content-Type', 'audio/mpeg');

        // Proses download langsung di-stream ke response browser
        const stream = ytDl.exec(url, {
            format: 'bestaudio',
            output: '-', // Output ke stdout (stream)
        });

        stream.stdout.pipe(res);
    } catch (err) {
        res.status(500).send("Gagal download");
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API jalan di port ${PORT}`));
