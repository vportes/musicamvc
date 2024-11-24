const express = require('express');
const { Artist, Album, Genre } = require('../models');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Buscar todos os artistas com seus gêneros e álbuns
router.get('/', async (req, res) => {
    try {
        const artists = await Artist.findAll({
            include: [
                { model: Genre, as: 'genres' },
                { model: Album, as: 'albums' }
            ]
        });
        res.json(artists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Criar um novo artista com gêneros e álbuns associados
router.post('/', async (req, res) => {
    try {
        const { name, genreIds, albumIds } = req.body;
        const artist = await Artist.create({ name });

        if (genreIds && genreIds.length > 0) {
            const genres = await Genre.findAll({ where: { id: genreIds } });
            await artist.setGenres(genres);
        }

        if (albumIds && albumIds.length > 0) {
            const albums = await Album.findAll({ where: { id: albumIds } });
            await artist.setAlbums(albums);
        }

        res.status(201).json(artist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Atualizar um artista com gêneros e álbuns associados
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

        res.json(artist);
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