const express = require('express');
const { Artist, Album, Genre } = require('../models');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/', async (req, res) => {
    try {
        const artists = await Artist.findAll({
            include: [
                { model: Genre, as: 'genres', through: { attributes: [] } },
                { model: Album, as: 'albums', through: { attributes: [] } }
            ]
        });
        res.json(artists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, genreIds, albumIds } = req.body;
        const artist = await Artist.create({ name });

        if (genreIds && genreIds.length > 0) {
            const genres = await Genre.findAll({ where: { id: genreIds } });

            const invalidGenres = genreIds.length !== genres.length;
            if (invalidGenres) {
                return res.status(400).json({ error: "Um ou mais IDs de gêneros são inválidos." });
            }

            await artist.setGenres(genres);
        }

        if (albumIds && albumIds.length > 0) {
            const albums = await Album.findAll({ where: { id: albumIds } });
            await artist.setAlbums(albums);
        }

        const createdArtist = await Artist.findByPk(artist.id, {
            include: [
                { model: Genre, as: 'genres', through: { attributes: [] } },
                { model: Album, as: 'albums', through: { attributes: [] } }
            ]
        });

        res.status(201).json(createdArtist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, genreIds, albumIds } = req.body;
        const artist = await Artist.findByPk(req.params.id);

        if (!artist) {
            return res.status(404).json({ error: 'Artista não encontrado' });
        }

        artist.name = name;
        await artist.save();

        if (genreIds && genreIds.length > 0) {
            const genres = await Genre.findAll({ where: { id: genreIds } });

            const invalidGenres = genreIds.length !== genres.length;
            if (invalidGenres) {
                return res.status(400).json({ error: "Um ou mais IDs de gêneros são inválidos." });
            }

            await artist.setGenres(genres);
        } else {
            await artist.setGenres([]);
        }

        if (albumIds && albumIds.length > 0) {
            const albums = await Album.findAll({ where: { id: albumIds } });
            await artist.setAlbums(albums);
        } else {
            await artist.setAlbums([]);
        }

        const updatedArtist = await Artist.findByPk(artist.id, {
            include: [
                { model: Genre, as: 'genres', through: { attributes: [] } },
                { model: Album, as: 'albums', through: { attributes: [] } }
            ]
        });

        res.json(updatedArtist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const artist = await Artist.findByPk(req.params.id);
        if (!artist) {
            return res.status(404).json({ error: 'Artista não encontrado' });
        }
        await artist.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;