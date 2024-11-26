const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const albumRoutes = require('./routes/albumRoutes');
const artistRoutes = require('./routes/artistRoutes');
const genreRoutes = require('./routes/genreRoutes');
const { Sequelize, DataTypes } = require('sequelize');

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
    }
);

const Album = require('./models/album')(sequelize, DataTypes);
const Artist = require('./models/artist')(sequelize, DataTypes);
const Genre = require('./models/genre')(sequelize, DataTypes);
const Track = require('./models/track')(sequelize, DataTypes);

Album.associate = function(models) {
    Album.belongsToMany(models.Artist, { through: 'AlbumArtists', as: 'artists', foreignKey: 'albumId' });
    Album.belongsToMany(models.Genre, { through: 'AlbumGenres', as: 'genres', foreignKey: 'albumId' });
    Album.hasMany(models.Track, { as: 'albumTracks', foreignKey: 'albumId' });
};
Artist.associate = function(models) {
    Artist.belongsToMany(models.Album, { through: 'AlbumArtists', as: 'albums', foreignKey: 'artistId' });
    Artist.belongsToMany(models.Genre, { through: 'ArtistGenres', as: 'genres', foreignKey: 'artistId' });
};
Genre.associate = function(models) {
    Genre.belongsToMany(models.Album, { through: 'AlbumGenres', as: 'albums', foreignKey: 'genreId' });
    Genre.belongsToMany(models.Artist, { through: 'ArtistGenres', as: 'artists', foreignKey: 'genreId' });
};
Track.associate = function(models) {
    Track.belongsTo(models.Album, { as: 'album', foreignKey: 'albumId' });
};

Album.associate({ Artist, Genre, Track });
Artist.associate({ Album, Genre });
Genre.associate({ Album, Artist });
Track.associate({ Album });

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/albums', albumRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/genres', genreRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

sequelize.sync({ force: false })
    .then(() => {
        console.log('Database synchronized successfully!');
        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    })
    .catch((err) => {
        console.error('Error synchronizing the database:', err);
    });