let authentication = (req, res, next) => {
  try {
    let { amount, customerEmail } = req.body;
    console.log(req.body);
    if (!amount || !customerEmail) throw { name: "Bad Request" };
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = authentication;
