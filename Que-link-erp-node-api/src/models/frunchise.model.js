const bcrypt = require('bcrypt');
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Franchise extends Model {
    }

    Franchise.init({
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        tenantId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        networkServerId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: "network_server",
                key: "id"
            }
        },
    }, {
        sequelize,
        modelName: 'franchise',
        freezeTableName: true,
        underscored: true,
        timestamps: true,
        paranoid: true,
    });

    return Franchise;
};
