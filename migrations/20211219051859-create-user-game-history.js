'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('User_game_histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      round: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      player_1_pick: {
        type: Sequelize.STRING,
        allowNull: true
      },
      player_2_pick: {
        type: Sequelize.STRING,
        allowNull: true
      },
      round_winner: {
        type: Sequelize.INTEGER,
        allowNull: true
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('User_game_histories');
  }
};