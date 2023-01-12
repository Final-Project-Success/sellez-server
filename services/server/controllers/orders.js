const { Order, OrderProduct, Product, sequelize } = require("../models");

const axios = require("axios");
const Xendit = require("xendit-node");
const x = new Xendit({
  secretKey: process.env.API_XENDIT,
});

const { Invoice, Payout } = x;
const invoiceSpecificOptions = {};
const payoutSpecificOptions = {};
const i = new Invoice(invoiceSpecificOptions);
const p = new Payout(payoutSpecificOptions);

class Controller {
  static async addOrders(req, res, next) {
    try {
      const { totalPrice, shippingCost, products } = req.body;
      let p = JSON.parse(products);
      let mapping = p.map((el) => {
        return {
          name: el.name,
          quantity: el.cartQuantity,
          price: el.price,
          url: el.imgUrl,
        };
      });
      const result = await sequelize.transaction(async (t) => {
        let idPayout = "invoice-sellez-id-" + new Date().getTime().toString(); //
        let invoice = await i.createInvoice({
          externalID: idPayout,
          payerEmail: req.User.email,
          description: `Invoice for ${idPayout}`,
          amount: totalPrice,
          items: mapping,
          successRedirectURL: "https://sellez-web.web.app/orders",
          failureRedirectURL: "https://sellez-web.web.app/orders",
          fees: [
            {
              type: "Handling Fee",
              value: shippingCost,
            },
          ],
        });
        const newOrder = await Order.create(
          {
            totalPrice,
            UserId: req.User.id,
            shippingCost: shippingCost,
            status: false,
            invoice: invoice.id,
          },
          { transaction: t }
        );
        const data = await p.map((el) => {
          Product.decrement("stock", {
            by: el.cartQuantity,
            where: { id: el.id },
            transaction: t,
          });
          return {
            ProductId: el.id,
            OrderId: newOrder.id,
            quantity: el.cartQuantity,
            subTotal: el.price * el.cartQuantity,
            price: el.price,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        });
        let c = await OrderProduct.bulkCreate(data, { transaction: t });

        return invoice;
      });

      res.status(201).json({ invoice_url: result.invoice_url });
    } catch (err) {
      next(err);
    }
  }
  static async readAllOrders(req, res, next) {
    try {
      const orders = await Order.findAll({
        where: { UserId: req.User.id },
      });

      res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  }

  static async readAllOrdersAdmin(req, res, next) {
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
      const order = await Order.findByPk(id, {
        include: [{ model: OrderProduct, include: [Product] }],
      });
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
      let x = req.headers["x-callback-token"];
      let { status, paid_amount, id } = req.body;
      if (x !== process.env.XENDIT_X) {
        return res.status(401).json({ message: "You are not authorized" });
      }
      if (status === "PAID") {
        let data = await Order.findOne({ where: { invoice: id } });
        if (!data) {
          return res.status(404).json({ message: "Data not found" });
        }

        if (data.totalPrice !== paid_amount) {
          return res
            .status(400)
            .json({ message: "Paid amount not same with amount" });
        }

        let updatedPayment = await Order.update(
          { status: "PAID" },
          { where: { invoice: id } }
        );

        return res.status(200).json({ message: "Update to PAID Success" });
      } else if (status === "EXPIRED") {
        let data = await Order.findOne({ where: { invoice: id } });
        let orderProd = await OrderProduct.findAll({
          where: { OrderId: data.id },
        });
        orderProd.forEach((el) => {
          Product.increment("stock", {
            by: el.dataValues.quantity,
            where: { id: el.ProductId },
          });
        });
        if (!data) {
          return res.status(404).json({ message: "Data not found" });
        }
        let updatedPayment = await Order.update(
          { status: "EXPIRED" },
          { where: { invoice: id } }
        );
        return res.status(200).json({ message: "Update to Expired Success" });
      }
    } catch (err) {
      next(err);
    }
  }
  static async destination(req, res, next) {
    try {
      console.log("masuk");
      const { data } = await axios.get(
        `https://api.rajaongkir.com/starter/city`,
        {
          headers: {
            key: process.env.RAJA_ONGKIR,
          },
        }
      );
      console.log(data.rajaongkir.results, "???");
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  static async cost(req, res, next) {
    try {
      console.log("MASUK SINI");
      const { destination, courier } = req.body;
      console.log(req.body);
      const request = {
        origin: 151,
        destination,
        weight: 2000,
        courier,
      };
      const { data } = await axios.post(
        `https://api.rajaongkir.com/starter/cost`,
        request,
        {
          headers: {
            key: process.env.RAJA_ONGKIR,
          },
        }
      );

      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = Controller;
