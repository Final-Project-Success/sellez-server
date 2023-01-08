const { Order } = require("../models");

async function authorizationOrder(req, res, next) {
  try {
    const [order, created] = await Order.findOrCreate({
      where: { status: false },
      defaults: {
        totalPrice: 9,
        UserId: req.User.id,
        shippingCost: 0,
        status: false,
      },
    });
    // console.log(order, created);

    req.Order = {
      OrderId: order ? order.id : created.id,
    };

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authorizationOrder;
