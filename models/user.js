'use strict';
const {
  Model
} = require('sequelize');

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Game_room, { foreignKey: 'player_1_id' })
      User.hasMany(models.Game_room, { foreignKey: 'player_2_id' })
    }

    static #encrypt  (password) {
      return bcrypt.hashSync(password, 10)
    }

    static register = async({ username, password }) => {
      const encryptedPassword = this.#encrypt(password)
      return await this.create({ username, password: encryptedPassword, asAdmin: false })
    }

    checkPassword = (password) => bcrypt.compareSync(password, this.password)

    generateToken = () => {
      const payload = {
        id: this.id,
        username: this.username,
      }
      const secret = 'aslkdmwjk13j4k32nkmlfaoijas'
      const token = jwt.sign(payload, secret)
      return token
    }

    static authenticate = async({ username, password }) => {
      try {
        const user = await this.findOne({ where: { username } })
        if(!user) return Promise.reject('User not found!')

        const isPasswordValid = user.checkPassword(password)
        if(!isPasswordValid) return Promise.reject('Wrong password!')

        return Promise.resolve(user)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  };
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    asAdmin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};