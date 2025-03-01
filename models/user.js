'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class user extends Model {
        static associate(models) {
            // define association here
            user.hasMany(models.tambahPemasukan, {
                foreignKey: 'id_user',
                as: 'tambahPemasukans',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
            user.hasMany(models.tambahPengeluaran, {
                foreignKey: 'id_user',
                as: 'tambahPengeluarans',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            });
        }
    }
    user.init({
        username: DataTypes.STRING,
        password: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'user',
    });
    return user;
};