'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.renameColumn('stoks', 'stok', 'stock');
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.renameColumn('stoks', 'stock', 'stok');
    }
};