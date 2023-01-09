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
      const { totalPrice, shippingCost } = req.body;

      const newOrder = await Order.create({
        totalPrice,
        UserId: req.User.id,
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

      await redis.del("sellez-orders");

      res.status(200).json(createdInvoice);
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

      const orders = await Order.findAll();

      await redis.set("sellez-orders", JSON.stringify(orders));

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
  static async checkOutOrder(req, res, next) {
    try {
      const { id } = req.params;
      const { totalPrice, shippingCost } = req.body;
      const order = await Order.findByPk(id);

      if (!order) {
        throw {
          name: "Order Not Found",
        };
      }

      await Order.update(
        {
          totalPrice,
          shippingCost,
        },
        { where: { id, status: false } }
      );

      await redis.del("sellez-orders");

      res.status(200).json({ msg: "Success to order" });
    } catch (err) {
      next(err);
    }
  }
  static async updateStatusOrder(req, res, next) {
    //   {
    //     "id": "579c8d61f23fa4ca35e52da4",
    //     "external_id": "invoice_123124123",
    //     "user_id": "5781d19b2e2385880609791c",
    //     "is_high": true,
    //     "payment_method": "BANK_TRANSFER",
    //     "status": "PAID",
    //     "merchant_name": "Xendit",
    //     "amount": 50000,
    //     "paid_amount": 50000,
    //     "bank_code": "PERMATA",
    //     "paid_at": "2016-10-12T08:15:03.404Z",
    //     "payer_email": "wildan@xendit.co",
    //     "description": "This is a description",
    //     "adjusted_received_amount": 47500,
    //     "fees_paid_amount": 0,
    //     "updated": "2016-10-10T08:15:03.404Z",
    //     "created": "2016-10-10T08:15:03.404Z",
    //     "currency": "IDR",
    //     "payment_channel": "PERMATA",
    //     "payment_destination": "888888888888"
    // }

    try {
      const { payer_email } = req.body;
      const order = await Order.findByPk(id);

      if (!order) {
        throw {
          name: "Order Not Found",
        };
      }

      await Order.update({ status: true }, { where: { id } });
      await redis.del("sellez-orders");

      res.status(200).json({
        msg: "Order already paid",
      });
    } catch (err) {
      next(err);
    }
  }
  static async destination(req, res, next) {
    try {
      const { data } = await axios({
        method: `GET`,
        url: `https://api.rajaongkir.com/starter/city`,
        headers: {
          key: process.env.RAJA_ONGKIR,
        },
      });
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
  static async cost(req, res, next) {
    try {
      // console.log("object");
      const { origin, destination, weight, courier } = req.body;
      const { data } = await axios({
        method: `POST`,
        url: `https://api.rajaongkir.com/starter/cost`,
        headers: {
          key: process.env.RAJA_ONGKIR,
        },
        data: {
          origin,
          destination,
          weight,
          courier,
        },
      });

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

      res.status(200).json(data.rajaongkir);
    } catch (error) {
      res.status(500).json(error);
      next(error);
    }
  }
}

module.exports = Controller;
