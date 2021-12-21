'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game_room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Game_room.belongsTo(models.User, { foreignKey: 'player_1_id' })
      Game_room.belongsTo(models.User, { foreignKey: 'player_2_id' })
      Game_room.hasMany(models.User_game_history, { foreignKey: 'room_id' })
    }
  };
  Game_room.init({
    player_1_id: DataTypes.INTEGER,
    player_2_id: DataTypes.INTEGER,
    room_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Game_room',
  });
  return Game_room;
};