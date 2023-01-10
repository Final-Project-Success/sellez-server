"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class otp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  otp.init(
    {
      idUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Id User is required",
          },
          notEmpty: {
            msg: "Id User is required",
          },
        },
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "OTP is required",
          },
          notEmpty: {
            msg: "OTP required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "otp",
    }
  );
  return otp;
};
