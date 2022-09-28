const bcrypt = require("bcrypt");
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class Token extends Model {
    }

    Token.init({

        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        key: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'AUTH'
        },
        loginAt: {
            type: DataTypes.DATE,
        },
        lastSeenAt: {
            type: DataTypes.DATE,
        },
        logoutAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        userAgent: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        ipAddress: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        blacklistedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'token',
        freezeTableName: true,
        underscored: true,
        timestamps: true,
        paranoid: true,
        updatedAt: false,
        createdAt: 'loginAt',
        deletedAt: 'blacklistedAt'
    });

    Token.addHook('beforeSave', async (token, options) => {
        if (token.changed('key')) {
            const key = token.dataValues.key;
            if(!key) {
                return;
            }
            const salt = await bcrypt.genSalt(10);
            token.key = await bcrypt.hash(key+'', salt);
        }
    });

    Token.prototype.isKeyMatch = async function (key) {
        return bcrypt.compare(key, this.key);
    };

    return Token;
};
