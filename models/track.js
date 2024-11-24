module.exports = (sequelize, DataTypes) => {
    const Track = sequelize.define('Track', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: true, // Permite valores nulos
            defaultValue: 0, // Ou defina um valor padrão
        },
    });
    Track.associate = (models) => {
        Track.belongsTo(models.Album);
    };

    return Track;
};