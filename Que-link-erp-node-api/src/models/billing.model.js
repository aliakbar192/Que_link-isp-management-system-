const bcrypt = require("bcrypt");
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Billing extends Model {}

  Billing.init(
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      franchiseId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "franchise",
          key: "id",
        },
      },
      dealerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "dealer",
          key: "id",
        },
      },
      amount: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: "user",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "billing",
      freezeTableName: true,
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );

  return Billing;
};
