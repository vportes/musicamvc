const Sequelize = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST) {
    console.error("Faltando variáveis de ambiente para o banco de dados.");
    process.exit(1);
}

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Album = require('./album')(sequelize, Sequelize);
db.Artist = require('./artist')(sequelize, Sequelize);
db.Genre = require('./genre')(sequelize, Sequelize);
db.Track = require('./track')(sequelize, Sequelize);

db.Album.belongsToMany(db.Artist, { through: 'AlbumArtists', as: 'artists' });
db.Artist.belongsToMany(db.Album, { through: 'AlbumArtists', as: 'albums' });

db.Album.belongsToMany(db.Genre, { through: 'AlbumGenres', as: 'genres' });
db.Genre.belongsToMany(db.Album, { through: 'AlbumGenres', as: 'albums' });

db.Track.belongsTo(db.Album, { as: 'album' });
db.Album.hasMany(db.Track, { as: 'tracks' });

sequelize.sync({ force: false })
    .then(() => {
        console.log("Banco de dados sincronizado!");
    })
    .catch((error) => {
        console.error("Erro ao sincronizar o banco de dados:", error);
        process.exit(1); // Encerra o processo com erro se a sincronização falhar
    });

module.exports = db;