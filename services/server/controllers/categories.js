const { Category } = require("../models");
const redis = require("../config/connectRedis");

class Controller {
  static async getCategory(req, res, next) {
    try {
      const chaceData = await redis.get("sellez-categories");

      if (chaceData) {
        return res.status(200).json(JSON.parse(chaceData));
      }

      const category = await Category.findAll();

      await redis.set("sellez-categories", JSON.stringify(category));

      res.status(200).json(category);
    } catch (err) {
      next(err);
    }
  }
  static async postCategory(req, res, next) {
    try {
      const { name } = req.body;
      const category = await Category.create({ name });

      res.status(201).json(category);
    } catch (err) {
      next(err);
    }
  }
  static async getDetailCategory(req, res, next) {
    try {
      const { id } = req.params;
      const categoryById = await Category.findByPk(id);

      if (!categoryById) {
        throw {
          name: "Category Not Found",
        };
      }

      await redis.del("sellez-categories");

      res.status(200).json(categoryById);
    } catch (err) {
      next(err);
    }
  }
  static async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const categoryById = await Category.findByPk(id);

      if (!categoryById) {
        throw {
          name: "Category Not Found",
        };
      }

      await Category.update(
        {
          name,
        },
        {
          where: {
            id,
          },
        }
      );

      await redis.del("sellez-categories");

      res.status(200).json({
        message: `Category has been updated`,
      });
    } catch (err) {
      next(err);
    }
  }
  static async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      const categoryById = await Category.findByPk(id);

      if (!categoryById) {
        throw {
          name: "Category Not Found",
        };
      }

      await Category.destroy({
        where: {
          id,
        },
      });

      await redis.del("sellez-categories");

      res.status(200).json({
        message: `Category with name ${categoryById.name} has been deleted`,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
