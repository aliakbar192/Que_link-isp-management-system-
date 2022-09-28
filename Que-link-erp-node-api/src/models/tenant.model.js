const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Tenant extends Model {
    }

    Tenant.init({
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        companyName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:true
        },
        companySlogan: {
            type: DataTypes.STRING,
            allowNull: false
        },
        copyrightText: {
            type: DataTypes.STRING,
            allowNull: true
        },
    }, {
        sequelize,
        modelName: 'tenant',
        freezeTableName: true,
        underscored: true,
        timestamps: true,
        paranoid: true,
    });

    return Tenant;
};
