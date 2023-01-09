"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init(
    {
      totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Total price is required",
          },
          notEmpty: {
            msg: "Total price is required",
          },
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "User id is required",
          },
          notEmpty: {
            msg: "User id is required",
          },
        },
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Status is required",
          },
          notEmpty: {
            msg: "Status is required",
          },
        },
      },
      shippingCost: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Shipping cost is required",
          },
          notEmpty: {
            msg: "Shipping cost is required",
          },
        },
      },
      invoice: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
