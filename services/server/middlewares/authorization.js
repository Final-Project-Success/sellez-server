const { Order } = require("../models");

async function authorizationOrder(req, res, next) {
  try {
    const [order, created] = await Order.findOrCreate({
      where: { status: false, UserId: req.User.id },
      defaults: {
        totalPrice: 9,
        UserId: req.User.id,
        shippingCost: 0,
        status: false,
      },
    });

    req.Order = {
      OrderId: order ? order.id : created.id,
    };

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authorizationOrder;
