"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Otp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Otp.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "User ID is required",
          },
          notEmpty: {
            msg: "User ID is required",
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
            msg: "OTP is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Otp",
    }
  );
  return Otp;
};
