const { Product } = require("../models/index");

class Controller {
  static async getProduct(req, res, next) {
    try {
      const dataProduct = await Product.findAll();
      res.status(200).json(dataProduct);
    } catch (err) {
      next(err);
    }
  }
  static async postProduct(req, res, next) {
    try {
      const { name, price, description, imgUrl, stock, CategoryId, color } =
        req.body;
      const product = await Product.create({
        name,
        price,
        description,
        imgUrl,
        stock,
        CategoryId,
        color,
      });

      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }
  static async getDetailProduct(req, res, next) {
    try {
      const { id } = req.params;
      const productById = await Product.findByPk(id);

      if (!productById) {
        throw {
          name: "Product Not Found",
        };
      }

      res.status(200).json(productById);
    } catch (err) {
      next(err);
    }
  }
  static async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const { name, price, description, imgUrl, stock, CategoryId, color } =
        req.body;
      const productById = await Product.findByPk(id);

      if (!productById) {
        throw {
          name: "Product Not Found",
        };
      }

      await Product.update(
        {
          name,
          price,
          description,
          imgUrl,
          stock,
          CategoryId,
          color,
        },
        {
          where: {
            id,
          },
        }
      );

      res.status(200).json({
        message: `Product with name ${productById.name} has been updated`,
      });
    } catch (err) {
      next(err);
    }
  }
  static async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const productById = await Product.findByPk(id);

      if (!productById) {
        throw {
          name: "Product Not Found",
        };
      }

      await Product.destroy({
        where: {
          id,
        },
      });

      res.status(200).json({
        message: `Product with name ${productById.name} has been deleted`,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
