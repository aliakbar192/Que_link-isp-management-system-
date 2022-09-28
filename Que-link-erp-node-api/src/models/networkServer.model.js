const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class NetworkServer extends Model {
    }

    NetworkServer.init({
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
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        secret: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        port: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        apiPort: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        tenantId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },


    }, {
        sequelize,
        modelName: 'network_server',
        freezeTableName: true,
        underscored: true,
        timestamps: true,
        paranoid: true,
    });

    return NetworkServer;
};
