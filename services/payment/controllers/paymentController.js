const Xendit = require("xendit-node");
const x = new Xendit({
  secretKey:
    "xnd_development_Pty6063htungzNhy6dVevIoocvaQ6ekaGg3f4QUUii61sCAuHADwwqsi2yjvNa", //<<< ini tolong dimasukin ke dotenv
});
const { Invoice, Payout } = x;
const invoiceSpecificOptions = {};
const payoutSpecificOptions = {};
const i = new Invoice(invoiceSpecificOptions);
const p = new Payout(payoutSpecificOptions);

class PaymentController {
  static async createInvoice(req, res, next) {
    try {
      let idPayout = "invoice-sellez-id-" + new Date().getTime().toString(); //
      let { customerEmail } = req.body;
      let amount = +req.body.amount;
      let invoice = await i.createInvoice({
        externalID: idPayout,
        payerEmail: "findedUser@gg.co",
        description: `Invoice for ${idPayout}`,
        amount: 1000,
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
            value: 1000,
          },
        ],
      });
      console.log(invoice);
    } catch (error) {
      console.log(error);
    }

    // i.createInvoice({
    //   externalID: idPayout,
    //   payerEmail: "alfianwilfredohoris@gmail.com",
    //   description: "Sellez-Final-Project",
    //   amount: amount,
    //   // ini nama itemnya ada apa aja (array of object)
    //   items: [
    //     {
    //       name: "Air Conditioner",
    //       quantity: 1,
    //       price: 100000,
    //       category: "Electronic",
    //       url: "https://yourcompany.com/example_item",
    //     },
    //   ],
    //   //Ini fee buat biaya ongkir (Kirim valuenya aja berapa ongkirnya)
    //   fees: [
    //     {
    //       type: "Handling Fee",
    //       value: 5000,
    //     },
    //   ],
    // })
    //   .then((response) => {
    //     res.status(200).json(response);
    //   })
    //   .catch((err) => {
    //     next(err);
    //   });
  }

  static createPayout(req, res, next) {
    let idPayout = "invoice-sellez-id-" + new Date().getTime().toString(); //
    let { customerEmail } = req.body;
    let amount = +req.body.amount;
    p.createPayout({
      externalID: idPayout,
      amount: amount,
      email: "alfianwilfredohoris@gmail.com",
    }).then((response) => {
      console.log(response);
    });
  }
}
module.exports = PaymentController;
