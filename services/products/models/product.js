"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Product.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Name is required",
          },
          notEmpty: {
            msg: "Name is required",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Price is required",
          },
          notEmpty: {
            msg: "Price is required",
          },
          min: {
            args: 5000,
            msg: "Price min is Rp 5000",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Description is required",
          },
          notEmpty: {
            msg: "Description is required",
          },
        },
      },
      imgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Image Url is required",
          },
          notEmpty: {
            msg: "Image Url is required",
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Stock is required",
          },
          notEmpty: {
            msg: "Stock is required",
          },
          min: {
            args: 1,
            msg: "Stock min is 1",
          },
        },
      },
      CategoryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
