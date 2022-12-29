const { Category } = require("../models");

class CategoryController {
  static async getCategory(req, res, next) {
    try {
      const category = await Category.findAll();
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  }
  static async postCategory(req, res, next) {
    try {
      const { name } = req.body;
      const category = await Category.create({ name });

      res.status(201).json({
        message: `category with name ${category.name} has been created`,
      });
    } catch (error) {
      //   res.status(500).json(error);
      next(error);
    }
  }
  static async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const categoryById = await Category.findByPk(id);
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
      res.status(200).json({
        message: `Category with name ${categoryById.name} has been updated`,
      });
    } catch (error) {
      next(error);
    }
  }
  static async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      const categoryById = await Category.findByPk(id);
      if (!categoryById) {
        throw { name: "Id not found" };
      }
      await Category.destroy({
        where: {
          id,
        },
      });
      res.status(200).json({
        message: `Category with name ${categoryById.name} has been deleted`,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoryController;
