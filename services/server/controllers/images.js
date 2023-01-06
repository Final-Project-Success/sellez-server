const { Image } = require("../models");

class Controller {
  static async postImage(req, res, next) {
    try {
      const { ProductId } = req.params;
      const { imgUrl1, imgUrl2, imgUrl3, imgUrl4 } = req.body;

      if (!imgUrl1 || !imgUrl2 || !imgUrl3 || !imgUrl4) {
        throw { name: "Image url is required" };
      }

      if (!ProductId) {
        throw { name: "Product id is required" };
      }

      const data = [
        { imgUrl: imgUrl1, ProductId },
        { imgUrl: imgUrl2, ProductId },
        { imgUrl: imgUrl3, ProductId },
        { imgUrl: imgUrl4, ProductId },
      ];
      const newImages = await Image.bulkCreate(data);

      res.status(201).json(newImages);
    } catch (err) {
      next(err);
    }
  }
  static async getImage(req, res, next) {
    try {
      const images = await Image.findAll();

      res.status(200).json(images);
    } catch (err) {
      next(err);
    }
  }
  static async getDetailImage(req, res, next) {
    try {
      const { ProductId } = req.params;
      const imagesByProduct = await Image.findAll({ where: { ProductId } });

      if (!imagesByProduct) {
        throw {
          name: "Image Not Found",
        };
      }

      res.status(200).json(imagesByProduct);
    } catch (err) {
      next(err);
    }
  }
  static async deleteImage(req, res, next) {
    try {
      const { ProductId } = req.params;
      const imagesByProduct = await Image.findAll({ where: { ProductId } });

      if (!imagesByProduct) {
        throw {
          name: "Image Not Found",
        };
      }

      await Image.destroy({
        where: {
          ProductId,
        },
      });

      res.status(200).json({
        message: `Images has been deleted`,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
