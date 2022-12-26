function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let msg = err.msg || "Internal Server Error";

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

    case "Forbidden":
      status = 403;
      msg = "You have no access";
      break;
  }

  res.status(status).json({ msg });
}

module.exports = errorHandler;
