const { Order, OrderProduct, Product, User, sequelize } = require("../models");

const redis = require("../config/connectRedis");
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
        try {
          let idPayout = "invoice-sellez-id-" + new Date().getTime().toString(); //
          let invoice = await i.createInvoice({
            externalID: idPayout,
            payerEmail: req.User.email,
            description: `Invoice for ${idPayout}`,
            amount: totalPrice,
            items: mapping,
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

          res.status(200).json({ invoice_url: invoice.invoice_url });
          return newOrder;
        } catch (error) {
          console.log(error);
        }
      });
    } catch (err) {
      next(err);
    }
  }
  static async readAllOrders(req, res, next) {
    try {
      const chaceData = await redis.get("sellez-orders");

      if (chaceData) {
        return res.status(200).json(JSON.parse(chaceData));
      }

      const orders = await Order.findAll({
        include: [{ model: User }, { model: OrderProduct }],
      });

      await redis.set("sellez-orders", JSON.stringify(orders));

      res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  }
  static async readOneOrder(req, res, next) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id, { include: User });
      console.log(order, "dari order");
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
      console.log(req.body);
      let { status, paid_amount, id } = req.body;
      if (x !== "MAK8CELq5HOfMOAGkNi9Ys5VzPhzqmz2dklDwzalG16AOMFk") {
        res.status(401).json({ message: "You are not authorized" });
      }
      if (status === "PAID") {
        let data = await Order.findOne({ where: { invoice: id } });
        if (!data) {
          res.status(404).json({ message: "Data not found" });
        }

        if (data.totalPrice !== paid_amount) {
          res.status().json({ message: "Paid amount not same with amount" });
        }

        let updatedPayment = await Order.update(
          { status: "PAID" },
          { where: { invoice: id } }
        );

        console.log("HOREEE BERHASIL TERBAYAR");
        res.status(200).json({ message: "Update to PAID Success" });
      } else if (status === "EXPIRED") {
        let data = await Order.findOne({ where: { invoice: id } });
        if (!data) {
          res.status(404).json({ message: "Data not found" });
        }
        let updatedPayment = await Order.update(
          { status: "EXPIRED" },
          { where: { invoice: id } }
        );
        console.log("HOREE GAGAL, INVOICENYA EXPIRED");
        res.status(200).json({ message: "Update to Expired Success" });
      }
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async destination(req, res, next) {
    try {
      const { data } = await axios.get(
        `https://api.rajaongkir.com/starter/city`,
        {
          headers: {
            key: process.env.RAJA_ONGKIR,
          },
        }
      );
      res.status(200).json(data);
    } catch (error) {
      console.log(error, "dari siniii");
      next(error);
    }
  }
  static async cost(req, res, next) {
    try {
      // console.log("object");
      const { origin, destination, weight, courier } = req.body;
      const request = {
        origin,
        destination,
        weight,
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
      // let response = {
      //   originType: data.rajaongkir.origin_details.type,
      //   originName: data.rajaongkir.origin_details.city_name,
      //   destinationType: data.rajaongkir.destination_details.type,
      //   destinationName: data.rajaongkir.destination_details.city_name,
      //   courier: data.rajaongkir.results[0].name,
      //   services: data.rajaongkir.results[0].costs.map((cost) => {
      //     return cost;
      //   }),
      //   // price: data.rajaongkir.results[0].costs[0].cost[0].value,
      // };

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = Controller;
