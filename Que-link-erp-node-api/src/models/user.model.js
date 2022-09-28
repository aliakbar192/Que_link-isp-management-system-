const bcrypt = require("bcrypt");
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}

  User.init(
    {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "user",
      freezeTableName: true,
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );

  User.addHook("afterValidate", async (user, options) => {
    if (user.changed("password")) {
      let { password } = user._previousDataValues.password
        ? user._previousDataValues
        : user.dataValues;
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    if (user.changed("email")) {
      user.email = user.email.toLowerCase();
    }
  });

  User.prototype.isPasswordMatch = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};
