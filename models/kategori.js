'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class kategori extends Model {
        static associate(models) {
            // define association here
            kategori.hasMany(models.tambahPengeluaran, {
                foreignKey: 'id_kategori',
                as: 'tambahPengeluarans',
            });
        }
    }
    kategori.init({
        namaKategori: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'kategori',
    });
    return kategori;
};