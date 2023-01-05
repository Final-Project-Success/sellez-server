function errorHandler(err, req, res, next) {
  let status = 500;
  let msg = "Internal Server Error";

  switch (err.name) {
    case "SequelizeUniqueConstraintError":
    case "SequelizeValidationError":
      status = 400;
      msg = err.errors.map((el) => el.message)[0];
      break;

    case "Product Not Found":
      status = 404;
      msg = "Product Not Found";
      break;
  }

  res.status(status).json({ msg });
}

module.exports = errorHandler;
