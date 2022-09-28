const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {}

  UserRole.init(
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "user_role",
      freezeTableName: true,
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );

  return UserRole;
};
