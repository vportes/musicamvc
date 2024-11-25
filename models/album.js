module.exports = (sequelize, DataTypes) => {
    const Album = sequelize.define('Album', {
        title: DataTypes.STRING,
        year: DataTypes.INTEGER,
        cover: DataTypes.STRING,
        tracks: DataTypes.JSON
    });

    Album.associate = function(models) {
        Album.belongsToMany(models.Artist, { through: 'AlbumArtists', as: 'artists', foreignKey: 'albumId' });
        Album.belongsToMany(models.Genre, { through: 'AlbumGenres', as: 'genres', foreignKey: 'albumId' });
        Album.hasMany(models.Track, { as: 'albumTracks', foreignKey: 'albumId' });
    };

    return Album;
};