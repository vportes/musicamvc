module.exports = (sequelize, DataTypes) => {
    const Genre = sequelize.define('Genre', {
        name: DataTypes.STRING
    });

    Genre.associate = function(models) {
        Genre.belongsToMany(models.Album, { through: 'AlbumGenres', as: 'albums', foreignKey: 'genreId' });
        Genre.belongsToMany(models.Artist, { through: 'ArtistGenres', as: 'artists', foreignKey: 'genreId' });
    };

    return Genre;
};