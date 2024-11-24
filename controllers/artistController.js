const db = require('../models');

// Criar um artista
exports.createArtist = async (req, res) => {
    try {
        const { name, genre } = req.body;
        const artist = await db.Artist.create({ name, genre });
        res.status(201).json(artist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar artista' });
    }
};

// Buscar todos os artistas
exports.getArtists = async (req, res) => {
    try {
        const artists = await db.Artist.findAll();
        res.status(200).json(artists);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar artistas' });
    }
};

// Editar artista
exports.updateArtist = async (req, res) => {
    try {
        const { name, genre } = req.body;
        const artist = await db.Artist.findByPk(req.params.id);

        if (!artist) {
            return res.status(404).json({ error: 'Artista não encontrado' });
        }

        artist.name = name;
        artist.genre = genre;
        await artist.save();

        res.status(200).json(artist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao editar artista' });
    }
};

// Excluir artista
exports.deleteArtist = async (req, res) => {
    try {
        const artist = await db.Artist.findByPk(req.params.id);

        if (!artist) {
            return res.status(404).json({ error: 'Artista não encontrado' });
        }

        await artist.destroy();
        res.status(200).json({ message: 'Artista excluído com sucesso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao excluir artista' });
    }
};
