'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async(queryInterface, Sequelize) => {
        return queryInterface.addColumn('users', 'namaPengguna', {
            type: Sequelize.STRING,
            allowNull: false, // Bisa diubah sesuai kebutuhan
            defaultValue: '' // Bisa diubah sesuai kebutuhan
        });
    },

    down: async(queryInterface, Sequelize) => {
        return queryInterface.removeColumn('users', 'namaPengguna');
    }
};