let errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err.name === "Bad Request") {
    res.status(400).json({ message: "Amount or Email Customer is Empty" });
  } else {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = errorHandler;
