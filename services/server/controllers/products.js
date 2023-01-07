const { Product, Image, Category, sequelize } = require("../models/index");

class Controller {
  static async getProduct(req, res, next) {
    try {
      const dataProduct = await Product.findAll({
        include: Category,
      });

      res.status(200).json(dataProduct);
    } catch (err) {
      next(err);
    }
  }
  static async postProduct(req, res, next) {
    try {
      const images = req.files;
      const { name, price, description, stock, CategoryId, color } = req.body;
      const result = await sequelize.transaction(async (t) => {
        const product = await Product.create(
          {
            name,
            price,
            description,
            imgUrl: images[0].path,
            stock,
            CategoryId,
            color,
          },
          { transaction: t }
        );

        const data = images.map((el) => {
          return { imgUrl: el.path, ProductId: product.id };
        });

        const newImages = await Image.bulkCreate(data, { transaction: t });
        const newData = { ...product, Images: newImages };

        return newData;
      });

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
  static async getDetailProduct(req, res, next) {
    try {
      const { id } = req.params;
      const productById = await Product.findByPk(id, {
        include: [{ model: Image }, { model: Category }],
      });

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
        msg: `Product with name ${productById.name} has been updated`,
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
        msg: `Product with name ${productById.name} has been deleted`,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
