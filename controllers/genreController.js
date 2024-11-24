const db = require('../models');

// Criar um gênero
exports.createGenre = async (req, res) => {
    try {
        const { name } = req.body;
        const genre = await db.Genre.create({ name });
        res.status(201).json(genre);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar gênero' });
    }
};

// Buscar todos os gêneros
exports.getGenres = async (req, res) => {
    try {
        const genres = await db.Genre.findAll();
        res.status(200).json(genres);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar gêneros' });
    }
};

// Editar gênero
exports.updateGenre = async (req, res) => {
    try {
        const { name } = req.body;
        const genre = await db.Genre.findByPk(req.params.id);

        if (!genre) {
            return res.status(404).json({ error: 'Gênero não encontrado' });
        }

        genre.name = name;
        await genre.save();

        res.status(200).json(genre);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao editar gênero' });
    }
};

// Excluir gênero
exports.deleteGenre = async (req, res) => {
    try {
        const genre = await db.Genre.findByPk(req.params.id);

        if (!genre) {
            return res.status(404).json({ error: 'Gênero não encontrado' });
        }

        await genre.destroy();
        res.status(200).json({ message: 'Gênero excluído com sucesso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao excluir gênero' });
    }
};
