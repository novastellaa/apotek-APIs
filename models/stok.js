'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class stok extends Model {
        static associate(models) {
            // define association here
            stok.hasMany(models.tambahPemasukan, {
                foreignKey: 'id_stok',
                as: 'tambahPemasukans',
            });
            stok.hasMany(models.tambahPengeluaran, {
                foreignKey: 'id_stok',
                as: 'tambahPengeluarans',
            });
        }
    }
    stok.init({
        namaBarang: DataTypes.STRING,
        stock: DataTypes.INTEGER,
        hargaJual: DataTypes.DECIMAL,
        hargaBeli: DataTypes.DECIMAL
    }, {
        sequelize,
        modelName: 'stok',
    });
    return stok;
};