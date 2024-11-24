module.exports = (sequelize, DataTypes) => {
    const Artist = sequelize.define('Artist', {
        name: DataTypes.STRING,
        genre: DataTypes.STRING,
    });

    Artist.associate = function(models) {
        Artist.belongsToMany(models.Album, { through: 'AlbumArtists', as: 'albums' });
    };

    return Artist;
};