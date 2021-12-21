'use strict';

const bcrypt = require('bcrypt')

const init_user = {
  username: 'grotius.hasiholan',
  password: bcrypt.hashSync('admin', 10),
  asAdmin: true,
  createdAt: new Date(),
  updatedAt: new Date()
}

const init_user1 = {
  username: 'grotius',
  password: bcrypt.hashSync('admin', 10),
  asAdmin: false,
  createdAt: new Date(),
  updatedAt: new Date()
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('Users', [init_user, init_user1], {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {})
  }
};
