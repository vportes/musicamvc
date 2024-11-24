const express = require('express');
const path = require('path');
const multer = require('multer');
const { Album, Artist, Genre, Track } = require('../../models');
const app = express();
const port = 3000;

// Configuração para lidar com uploads de imagem (capa do álbum)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Middleware para analisar o corpo da requisição
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (como imagens de capa)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoints de Disco (Album)
app.get('/api/albums', async (req, res) => {
    try {
        const albums = await Album.findAll({
            include: [
                { model: Artist, as: 'artists' },
                { model: Genre, as: 'genres' }
            ]
        });
        res.json(albums);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/albums/:id', async (req, res) => {
    try {
        const album = await Album.findByPk(req.params.id, {
            include: [
                { model: Artist, as: 'artists' },
                { model: Genre, as: 'genres' }
            ]
        });
        if (album) {
            res.json(album);
        } else {
            res.status(404).json({ error: 'Álbum não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/albums', upload.single('cover'), async (req, res) => {
    try {
        const { title, year, tracks, artists, genres } = req.body;
        const album = await Album.create({
            title,
            year,
            cover: req.file ? req.file.path : null,
            tracks: JSON.parse(tracks)
        });
        if (artists && artists.length > 0) {
            await album.setArtists(artists);
        }
        if (genres && genres.length > 0) {
            await album.setGenres(genres);
        }

        res.status(201).json(album);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/albums/:id', upload.single('cover'), async (req, res) => {
    try {
        const { title, year, tracks, artists, genres } = req.body;
        const album = await Album.findByPk(req.params.id);

        if (!album) {
            return res.status(404).json({ error: 'Álbum não encontrado' });
        }

        album.title = title;
        album.year = year;
        album.tracks = JSON.parse(tracks);
        if (req.file) album.cover = req.file.path;
        await album.save();

        // Atualizar associações
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

app.delete('/api/albums/:id', async (req, res) => {
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

// Endpoints de Artista
app.get('/api/artists', async (req, res) => {
    try {
        const artists = await Artist.findAll();
        res.json(artists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/artists', async (req, res) => {
    try {
        const { name, genre, albumIds, genreIds } = req.body; // Alteração aqui para receber genreIds
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

router.put('/api/artists/:id', async (req, res) => {
    try {
        const { name, genre, genreIds, albumIds } = req.body;
        const artist = await Artist.findByPk(req.params.id);

        if (!artist) {
            return res.status(404).json({ error: 'Artista não encontrado' });
        }

        artist.name = name;
        await artist.save();

        if (genreIds && genreIds.length > 0) {
            const genres = await Genre.findAll({ where: { id: genreIds } });
            await artist.setGenres(genres);
        }

        if (albumIds && albumIds.length > 0) {
            const albums = await Album.findAll({ where: { id: albumIds } });
            await artist.setAlbums(albums);
        }

        res.json(artist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/artists/:id', async (req, res) => {
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

// Endpoints de Gênero
// Endpoint para listar gêneros
app.get('/api/genres', async (req, res) => {
    try {
        const genres = await Genre.findAll();
        console.log("Gêneros encontrados:", genres);  // Log para verificar
        res.json(genres);
    } catch (error) {
        console.error("Erro ao buscar gêneros:", error);
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para criar gênero
app.post('/api/genres', async (req, res) => {
    try {
        const { name } = req.body;
        const genre = await Genre.create({ name });
        res.status(201).json(genre);  // Retorna o gênero criado
    } catch (error) {
        console.error("Erro ao criar gênero:", error);
        res.status(500).json({ error: error.message });
    }
});


app.delete('/api/genres/:id', async (req, res) => {
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

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
