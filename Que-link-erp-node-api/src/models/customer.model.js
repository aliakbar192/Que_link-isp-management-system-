const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Customer extends Model {
    }

    Customer.init({
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
        nicNo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phoneNo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        dealerId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        secret: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        connectionType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        packageId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: "package",
                key: "id"
            }
        },
        onExpire: {
            type: DataTypes.STRING,
            allowNull: false,
            // validate: { isIn: ['AutoRenew', 'Expire'] },
        },

    }, {
        sequelize,
        modelName: 'customer',
        freezeTableName: true,
        underscored: true,
        timestamps: true,
        paranoid: true,
    });

    return Customer;

};
