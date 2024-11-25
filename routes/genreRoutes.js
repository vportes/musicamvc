const express = require('express');
const { Genre } = require('../models');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/', async (req, res) => {
    try {
        const genres = await Genre.findAll();
        res.json(genres);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        const genre = await Genre.create({ name });
        res.status(201).json(genre);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name } = req.body;
        const genre = await Genre.findByPk(req.params.id);

        if (!genre) {
            return res.status(404).json({ error: 'Gênero não encontrado' });
        }

        genre.name = name;
        await genre.save();

        res.json(genre);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const genre = await Genre.findByPk(req.params.id);
        if (!genre) {
            return res.status(404).json({ error: 'Gênero não encontrado' });
        }
        await genre.destroy();
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;