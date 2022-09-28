const bcrypt = require('bcrypt');
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Dealer extends Model {
    }

    Dealer.init({
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
        franchiseId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'dealer',
        freezeTableName: true,
        underscored: true,
        timestamps: true,
        paranoid: true,
    });

    return Dealer;
};
