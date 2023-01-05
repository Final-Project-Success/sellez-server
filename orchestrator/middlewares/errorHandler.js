function errorHandler(err, req, res, next) {
  let status = 500;
  let msg = "Internal Server Error";

  switch (err.name) {
    case "JsonWebTokenError":
    case "Unauthorized":
      status = 401;
      msg = "Please Login First";
      break;
  }

  res.status(status).json({ msg });
}

module.exports = errorHandler;
