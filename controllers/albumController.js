const db = require('../models');

// Criar um álbum
exports.createAlbum = async (req, res) => {
    try {
        const { title, year, tracks, artists, genres } = req.body;

        // Criar álbum no banco
        const album = await db.Album.create({ title, year });

        // Associar artistas, se fornecidos
        if (artists && artists.length > 0) {
            const artistRecords = await db.Artist.findAll({ where: { id: artists } });
            await album.addArtists(artistRecords);
        }

        // Associar gêneros, se fornecidos
        if (genres && genres.length > 0) {
            const genreRecords = await db.Genre.findAll({ where: { id: genres } });
            await album.addGenres(genreRecords);
        }

        // Adicionar faixas, se fornecidas
        if (tracks && tracks.length > 0) {
            for (const track of tracks) {
                await db.Track.create({ title: track, AlbumId: album.id });
            }
        }

        res.status(201).json(album);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar álbum' });
    }
};

// Buscar todos os álbuns
exports.getAlbums = async (req, res) => {
    try {
        const albums = await db.Album.findAll({
            include: [db.Artist, db.Genre, db.Track]
        });
        res.status(200).json(albums);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar álbuns' });
    }
};

// Editar álbum
exports.updateAlbum = async (req, res) => {
    try {
        const { title, year, tracks, artists, genres } = req.body;
        const album = await db.Album.findByPk(req.params.id);

        if (!album) {
            return res.status(404).json({ error: 'Álbum não encontrado' });
        }

        album.title = title;
        album.year = year;
        await album.save();

        // Atualizar faixas
        if (tracks && tracks.length > 0) {
            await db.Track.destroy({ where: { AlbumId: album.id } });
            for (const track of tracks) {
                await db.Track.create({ title: track, AlbumId: album.id });
            }
        }

        // Atualizar artistas
        if (artists && artists.length > 0) {
            const artistRecords = await db.Artist.findAll({ where: { id: artists } });
            await album.setArtists(artistRecords);
        }

        // Atualizar gêneros
        if (genres && genres.length > 0) {
            const genreRecords = await db.Genre.findAll({ where: { id: genres } });
            await album.setGenres(genreRecords);
        }

        res.status(200).json(album);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao editar álbum' });
    }
};

// Excluir álbum
exports.deleteAlbum = async (req, res) => {
    try {
        const album = await db.Album.findByPk(req.params.id);

        if (!album) {
            return res.status(404).json({ error: 'Álbum não encontrado' });
        }

        await album.destroy();
        res.status(200).json({ message: 'Álbum excluído com sucesso' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao excluir álbum' });
    }
};
