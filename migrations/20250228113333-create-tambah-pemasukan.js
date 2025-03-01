'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('tambahPemasukans', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            id_user: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
            },
            tanggal: {
                type: Sequelize.DATE
            },
            id_stock: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'stoks',
                    key: 'id',
                },
            },
            jumlah: {
                type: Sequelize.INTEGER
            },
            totalHarga: {
                type: Sequelize.DECIMAL
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('tambahPemasukans');
    }
};