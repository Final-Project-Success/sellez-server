const { Product } = require("../models/index");

class ProductController {
  static async getProduct(req, res, next) {
    try {
      const dataProduct = await Product.findAll();
      res.status(200).json(dataProduct);
    } catch (error) {
      res.status(500).json(error);
    }
  }
  static async postProduct(req, res, next) {
    try {
      const { name, price, description, imgUrl, stock, CategoryId } = req.body;
      const product = await Product.create({
        name,
        price,
        description,
        imgUrl,
        stock,
        CategoryId,
      });
      res.status(201).json({
        message: `Product with name ${product.name} has been created`,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
  static async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const { name, price, description, imgUrl, stock, CategoryId } = req.body;
      const productById = await Product.findByPk(id);
      await Product.update(
        {
          name,
          price,
          description,
          imgUrl,
          stock,
          CategoryId,
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
    } catch (error) {
      res.status(500).json(error);
    }
  }
  static async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const productById = await Product.findByPk(id);
      await Product.destroy({
        where: {
          id,
        },
      });
      res.status(200).json({
        message: `Product with name ${productById.name} has been deleted`,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
}

module.exports = ProductController;
