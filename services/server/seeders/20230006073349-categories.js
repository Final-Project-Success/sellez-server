"use strict";
const {hashPassword} = require("../helpers/bcrypt")


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
   
     await queryInterface.bulkInsert('Users', require("../db/user.json").map((el)=>{
      el.createdAt = new Date()
      el.updatedAt = new Date()
      el.password = hashPassword(el.password)
      return el
     }), {});
    await queryInterface.bulkInsert(
      "Categories",
      [
        {
          name: "Shoes",
        },
        {
          name: "T-Shirts",
        }
       
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
