const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const albumRoutes = require('./routes/albumRoutes');
const artistRoutes = require('./routes/artistRoutes');
const genreRoutes = require('./routes/genreRoutes');
const db = require('./models');

// Carregar configurações do arquivo .env
dotenv.config();

// Criar instância do express
const app = express();

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsing de JSON e dados de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar rotas da API
app.use('/api/albums', albumRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/genres', genreRoutes);

// Rota principal que exibe o front-end
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Conectar ao banco de dados e iniciar o servidor
db.sequelize.sync({ force: false }) // `force: false` preserva os dados no banco
    .then(() => {
        console.log('Banco de dados sincronizado com sucesso!');
        app.listen(3000, () => {
            console.log('Servidor rodando na porta 3000');
        });
    })
    .catch((err) => {
        console.error('Erro ao sincronizar o banco de dados:', err);
    });