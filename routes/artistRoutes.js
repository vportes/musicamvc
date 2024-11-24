const express = require('express');
const { Artist, Album } = require('../models'); // Ajuste o caminho conforme necessário

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/', async (req, res) => {
    try {
        const artists = await Artist.findAll();
        res.json(artists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, genre, albumIds } = req.body; // Alteração aqui para receber albumIds
        const artist = await Artist.create({ name, genre });

        // Se albumIds for fornecido, associar os álbuns ao artista
        if (albumIds && albumIds.length > 0) {
            const albums = await Album.findAll({ where: { id: albumIds } });
            await artist.setAlbums(albums);
        }

        res.status(201).json(artist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, genre } = req.body;
        const artist = await Artist.findByPk(req.params.id);

        if (!artist) {
            return res.status(404).json({ error: 'Artista não encontrado' });
        }

        artist.name = name;
        artist.genre = genre;
        await artist.save();

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