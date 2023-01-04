function errorHandler(err, req, res, next) {
  let status = 500;
  let msg = "Internal Server Error";

  switch (err.name) {
    case "SequelizeUniqueConstraintError":
    case "SequelizeValidationError":
      status = 400;
      msg = err.errors.map((el) => el.message)[0];
      break;

    case "Image Not Found":
      status = 404;
      msg = "Image Not Found";
      break;

    case "Image url is required":
      status = 400;
      msg = "Image url is required";
      break;

    case "Product id is required":
      status = 400;
      msg = "Product id is required";
      break;
  }

  res.status(status).json({ msg });
}

module.exports = errorHandler;
