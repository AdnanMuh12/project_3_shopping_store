'use strict';

const { hashPassword } = require("../utils/bcrypt")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const hashedPassword = await hashPassword("admin")
    
    await queryInterface.bulkInsert("Users",[{
      full_name: 'admin',
      email: "admin@gmail.com",
      password: hashedPassword,
      gender: "male",
      role: "admin",
      balance: 0,
      createdAt: new Date,
      updatedAt: new Date
    }], {})

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
