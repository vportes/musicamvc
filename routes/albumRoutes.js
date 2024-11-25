const express = require('express');
const multer = require('multer');
const path = require('path');
const { Album, Artist, Genre, Track } = require('../models');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
    try {
        const albums = await Album.findAll({
            include: [
                { model: Artist, as: 'artists', through: { attributes: [] } },
                { model: Genre, as: 'genres', through: { attributes: [] } },
                { model: Track, as: 'albumTracks' }
            ]
        });
        res.json({ albums });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', upload.single('cover'), async (req, res) => {
    try {
        const { title, year, tracks, artists, genres } = req.body;
        let parsedTracks = JSON.parse(tracks);
        let coverPath = req.file ? `/uploads/${req.file.filename}` : null;

        const album = await Album.create({
            title,
            year,
            cover: coverPath
        });

        if (artists && artists.length > 0) {
            await album.setArtists(artists);
        }

        if (genres && genres.length > 0) {
            await album.setGenres(genres);
        }

        if (parsedTracks.length > 0) {
            const tracksToCreate = parsedTracks.map(track => ({
                title: track.title,
                duration: track.duration || 0,
                albumId: album.id
            }));
            await Track.bulkCreate(tracksToCreate);
        }

        const albumCompleto = await Album.findByPk(album.id, {
            include: [
                { model: Artist, as: 'artists' },
                { model: Genre, as: 'genres' },
                { model: Track, as: 'albumTracks' }
            ]
        });

        res.status(201).json(albumCompleto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', upload.single('cover'), async (req, res) => {
    try {
        const { title, year, tracks, artists, genres } = req.body;
        let parsedTracks = JSON.parse(tracks);
        const album = await Album.findByPk(req.params.id);

        if (!album) {
            return res.status(404).json({ error: 'Álbum não encontrado' });
        }

        album.title = title ? title : album.title;
        album.year = year ? year : album.year;
        album.cover = req.file ? `/uploads/${req.file.filename}` : album.cover;
        album.tracks = parsedTracks;

        await album.save();

        if (artists && artists.length > 0) {
            await album.setArtists(artists);
        } else {
            await album.setArtists([]);
        }

        if (genres && genres.length > 0) {
            await album.setGenres(genres);
        } else {
            await album.setGenres([]);
        }

        const updatedAlbum = await Album.findByPk(album.id, {
            include: [
                { model: Artist, as: 'artists' },
                { model: Genre, as: 'genres' },
                { model: Track, as: 'albumTracks' }  // Ensure alias consistency
            ]
        });

        res.json(updatedAlbum);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const album = await Album.findByPk(req.params.id);
        if (!album) {
            return res.status(404).json({ error: 'Álbum não encontrado' });
        }
        await album.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;