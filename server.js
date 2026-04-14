const express = require('express');
const cors = require('cors');
const ytDl = require('yt-dlp-exec');
const app = express();

app.use(cors());
app.use(express.json());

// 1. Endpoint untuk ambil info lagu
app.get('/api/info', async (req, res) => {
    const { url } = req.query;
    try {
        // Menggunakan yt-dlp untuk ambil metadata
        const info = await ytDl(url, {
            dumpSingleJson: true,
            noCheckCertificates: true,
        });

        res.json({
            title: info.title,
            artist: info.uploader || 'Unknown Artist',
            cover: info.thumbnail,
            duration: new Date(info.duration * 1000).toISOString().substr(14, 5),
            downloadUrl: url // Kita teruskan URL asli ke downloader
        });
    } catch (err) {
        res.status(500).json({ error: "Gagal ambil info lagu" });
    }
});

// 2. Endpoint untuk proses download (streaming file)
app.get('/api/download', async (req, res) => {
    const { url } = req.query;
    try {
        // Header agar browser mengenali ini sebagai file MP3
        res.header('Content-Disposition', 'attachment; filename="music.mp3"');
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
