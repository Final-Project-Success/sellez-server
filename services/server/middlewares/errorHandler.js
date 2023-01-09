function errorHandler(err, req, res, next) {
  // console.log(err);
  let status = 500;
  let msg = "Internal Server Error";

  switch (err.name) {
    case "SequelizeUniqueConstraintError":
    case "SequelizeValidationError":
      status = 400;
      msg = err.errors.map((el) => el.message)[0];
      break;

    case "JsonWebTokenError":
    case "Unauthorized":
      status = 401;
      msg = "Please Login First";
      break;

    case "Error email or password":
      status = 401;
      msg = "Error invalid email or password";
      break;

    // case "Product id is required":
    //   status = 400;
    //   msg = "Product id is required";
    //   break;

    case "Category Not Found":
      status = 404;
      msg = "Category Not Found";
      break;

    case "OrderProduct Not Found":
      status = 404;
      msg = "OrderProduct Not Found";
      break;

    case "Product Not Found":
      status = 404;
      msg = "Product Not Found";
      break;

    case "Order Not Found":
      status = 404;
      msg = "Order Not Found";
      break;
  }

  res.status(status).json({ msg });
}

module.exports = errorHandler;
