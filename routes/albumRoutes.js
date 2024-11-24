const express = require('express');
const { Album, Artist, Genre, Track } = require('../models'); // Ajuste o caminho conforme necessário

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/', async (req, res) => {
    try {
        const albums = await Album.findAll({
            include: [
                { model: Artist, as: 'artists' },
                { model: Genre, as: 'genres' },
                { model: Track, as: 'tracks' }
            ]
        });
        res.json(albums);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, year, tracks, artists, genres } = req.body;
        const album = await Album.create({ title, year });

        if (artists && artists.length > 0) {
            await album.setArtists(artists);
        }

        if (genres && genres.length > 0) {
            await album.setGenres(genres);
        }

        let tracksArray = [];
        if (typeof tracks === 'string') {
            tracksArray = JSON.parse(tracks);
        } else if (Array.isArray(tracks)) {
            tracksArray = tracks;
        }

        if (tracksArray.length > 0) {
            const tracksToCreate = tracksArray.map(track => ({
                title: track.title,
                duration: track.duration || 0,
                AlbumId: album.id
            }));
            await Track.bulkCreate(tracksToCreate);
        }

        const albumCompleto = await Album.findByPk(album.id, {
            include: [Artist, Genre, Track]
        });

        res.status(201).json(albumCompleto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { title, year, tracks, artists, genres } = req.body;
        const album = await Album.findByPk(req.params.id);

        if (!album) {
            return res.status(404).json({ error: 'Álbum não encontrado' });
        }

        album.title = title;
        album.year = year;
        album.tracks = JSON.parse(tracks);
        await album.save();

        if (artists && artists.length > 0) {
            await album.setArtists(artists);
        }
        if (genres && genres.length > 0) {
            await album.setGenres(genres);
        }

        res.json(album);
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