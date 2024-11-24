module.exports = (sequelize, DataTypes) => {
    const Genre = sequelize.define('Genre', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            }
        },
    });

    Genre.associate = (models) => {
        Genre.belongsToMany(models.Album, { through: 'AlbumGenres' });
    };

    return Genre;
};
