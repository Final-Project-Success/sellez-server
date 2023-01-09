"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Image, {
        foreignKey: "ProductId",
      });
    }
  }
  Image.init(
    {
      imgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Img url is required",
          },
          notEmpty: {
            msg: "Img url is required",
          },
        },
      },
      ProductId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Product id is required",
          },
          notEmpty: {
            msg: "Product id is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Image",
    }
  );
  return Image;
};
