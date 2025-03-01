'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class tambahPemasukan extends Model {
        static associate(models) {
            // define association here
            tambahPemasukan.belongsTo(models.user, {
                foreignKey: 'id_user',
            });
            tambahPemasukan.belongsTo(models.stok, {
                foreignKey: 'id_stock',
            });
        }
    }
    tambahPemasukan.init({
        id_user: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
        },
        tanggal: DataTypes.DATE,
        id_stock: {
            type: DataTypes.INTEGER,
            references: {
                model: 'stok',
                key: 'id',
            },
        },
        jumlah: DataTypes.INTEGER,
        totalHarga: DataTypes.DECIMAL
    }, {
        sequelize,
        modelName: 'tambahPemasukan',
    });
    return tambahPemasukan;
};