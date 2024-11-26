const express = require('express');
const { Album, Artist, Genre } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

router.get('/albums', async (req, res) => {
    try {
        const query = req.query.q.toLowerCase();
        const albums = await Album.findAll({
            include: [
                { model: Artist, as: 'artists' },
                { model: Genre, as: 'genres', where: { name: { [Op.like]: `%${query}%` } }, required: false }
            ],
            where: {
                [Op.or]: [
                    { title: { [Op.like]: `%${query}%` } },
                    { '$genres.name$': { [Op.like]: `%${query}%` } }
                ]
            }
        });
        res.json({ albums });
    } catch (error) {
        console.error('Erro ao buscar álbuns:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/artists', async (req, res) => {
    try {
        const query = req.query.q.toLowerCase();
        const artists = await Artist.findAll({
            include: [
                { model: Genre, as: 'genres', where: { name: { [Op.like]: `%${query}%` } }, required: false },
                { model: Album, as: 'albums' }
            ],
            where: {
                [Op.or]: [
                    { name: { [Op.like]: `%${query}%` } },
                    { '$genres.name$': { [Op.like]: `%${query}%` } }
                ]
            }
        });
        res.json({ artists });
    } catch (error) {
        console.error('Erro ao buscar artistas:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/genres', async (req, res) => {
    try {
        const query = req.query.q.toLowerCase();
        const genres = await Genre.findAll({
            where: { name: { [Op.like]: `%${query}%` } }
        });
        res.json({ genres });
    } catch (error) {
        console.error('Erro ao buscar gêneros:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;