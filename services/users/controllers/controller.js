class Controller {
  static async register(req, res, next) {
    try {
      const { username, email, password, address, profilePict } = req.body;
      const newUser = await User.create({
        username,
        email,
        password,
        address,
        profilePict,
        role: "customer",
      });

      res.status(201).json({
        id: newUser.id,
        email: newUser.email,
        msg: "Register Success!",
      });
    } catch (err) {
      next(err);
    }
  }
  static async login(req, res, next) {
    try {
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
