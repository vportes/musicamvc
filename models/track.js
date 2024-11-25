module.exports = (sequelize, DataTypes) => {
    const Track = sequelize.define('Track', {
        title: DataTypes.STRING,
        duration: DataTypes.INTEGER
    });

    Track.associate = function(models) {
        Track.belongsTo(models.Album, { as: 'album', foreignKey: 'albumId' });
    };

    return Track;
};