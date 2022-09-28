const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class CustomerSubscription extends Model {
    }

    CustomerSubscription.init({
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        customerId: {
            type: DataTypes.BIGINT,
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
        startAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        payable: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        paid: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'customer_subscription',
        freezeTableName: true,
        underscored: true,
        timestamps: true,
        paranoid: true,
        createdAt: 'startAt',
    });

    return CustomerSubscription;
};
