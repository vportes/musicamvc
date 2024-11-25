module.exports = (sequelize, DataTypes) => {
    const Artist = sequelize.define('Artist', {
        name: DataTypes.STRING
    });

    Artist.associate = function(models) {
        Artist.belongsToMany(models.Album, { through: 'AlbumArtists', as: 'albums', foreignKey: 'artistId' });
        Artist.belongsToMany(models.Genre, { through: 'ArtistGenres', as: 'genres', foreignKey: 'artistId' });
    };

    return Artist;
};