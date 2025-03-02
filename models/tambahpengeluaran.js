'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class tambahPengeluaran extends Model {
        static associate(models) {
            // define association here
            tambahPengeluaran.belongsTo(models.user, {
                foreignKey: 'id_user',
            });
            tambahPengeluaran.belongsTo(models.stok, {
                foreignKey: 'id_stock',
            });
            tambahPengeluaran.belongsTo(models.kategori, {
                foreignKey: 'id_kategori',
            });
        }
    }
    tambahPengeluaran.init({
        id_user: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
        },
        tanggal: DataTypes.DATE,
        id_kategori: {
            type: DataTypes.INTEGER,
            references: {
                model: 'kategori',
                key: 'id',
            },
        },
        id_stock: {
            type: DataTypes.INTEGER,
            field: 'id_stock',
            references: {
                model: 'stok',
                key: 'id',
            },
        },
        jumlah: DataTypes.INTEGER,
        totalHarga: DataTypes.DECIMAL
    }, {
        sequelize,
        modelName: 'tambahPengeluaran',
    });
    return tambahPengeluaran;
};