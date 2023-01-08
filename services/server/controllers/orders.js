const { Order, User } = require("../models");
const Xendit = require("xendit-node");
const x = new Xendit({
  secretKey: process.env.SECRET_XENDIT,
});
const { Invoice } = x;
const invoiceSpecificOptions = {};
const i = new Invoice(invoiceSpecificOptions);

class Controller {
  static async addOrders(req, res, next) {
    try {
      const { name, totalPrice, UserId, shippingCost } = req.body;
      const newOrder = await Order.create({
        name,
        totalPrice,
        UserId,
        shippingCost,
        status: false,
      });

      let findedUser = await User.findByPk({ where: { id: UserId } });
      let idPayout = "invoice-sellez-id-" + new Date().getTime().toString(); //
      let createdInvoice = await i.createInvoice({
        externalID: idPayout,
        payerEmail: findedUser,
        description: `Invoice for ${idPayout}`,
        amount: totalPrice,
        // ini nama itemnya ada apa aja (array of object)
        items: [
          {
            name: "Air Conditioner",
            quantity: 1,
            price: 100000,
            category: "Electronic",
            url: "https://yourcompany.com/example_item",
          },
        ],
        fees: [
          {
            type: "Handling Fee",
            value: shippingCost,
          },
        ],
      });
      res.status(200).json(createdInvoice);
    } catch (err) {
      next(err);
    }
  }
  static async readAllOrders(req, res, next) {
    try {
      const orders = await Order.findAll();
      res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  }
  static async readOneOrder(req, res, next) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);

      if (!order) {
        throw {
          name: "Order Not Found",
        };
      }
      res.status(200).json(order);
    } catch (err) {
      next(err);
    }
  }
  static async updateStatusOrder(req, res, next) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id);

      if (!order) {
        throw {
          name: "Order Not Found",
        };
      }

      await Order.update({ status: true }, { where: { id } });

      res.status(200).json({
        msg: "Order already paid",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
