'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_game_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User_game_history.belongsTo(models.Game_room, { foreignKey: 'room_id' })
    }
  };
  User_game_history.init({
    room_id: DataTypes.STRING,
    round: DataTypes.INTEGER,
    player_1_pick: DataTypes.STRING,
    player_2_pick: DataTypes.STRING,
    round_winner: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User_game_history',
  });
  return User_game_history;
};