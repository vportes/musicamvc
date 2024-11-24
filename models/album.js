module.exports = (sequelize, DataTypes) => {
    const Album = sequelize.define('Album', {
        title: DataTypes.STRING,
        year: DataTypes.INTEGER
    });

    Album.associate = function(models) {
        Album.belongsToMany(models.Artist, { through: 'AlbumArtists', as: 'artists' });
        Album.belongsToMany(models.Genre, { through: 'AlbumGenres', as: 'genres' });
        Album.hasMany(models.Track, { as: 'tracks' });
    };

    return Album;
};