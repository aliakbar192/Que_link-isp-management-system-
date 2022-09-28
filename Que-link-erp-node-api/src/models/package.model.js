const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Package extends Model {
    }

    Package.init({
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        packageName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        profileName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        billingType: {
            type: DataTypes.STRING,
            allowNull: false,
            // validate: { isIn: ['Prepaid', 'Postpaid'] },
        },
        charges: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        duration: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        durationType: {
            type: DataTypes.STRING,
            allowNull: false,
            // validate: { isIn: ['Year', 'Month', 'Week', 'Day', 'Hour', 'Minute'] },
        },
        dataQuotaVolume: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        dataQuotaVolumeType: {
            type: DataTypes.STRING,
            allowNull: true,
            // validate: { isIn: ['TB', 'GB', 'MB', 'KB'] },
        },
        tenantId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },

    }, {
        sequelize,
        modelName: 'package',
        freezeTableName: true,
        underscored: true,
        timestamps: true,
        paranoid: true,
    });

    return Package;

};
