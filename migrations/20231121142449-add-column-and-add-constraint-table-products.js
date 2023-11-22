'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn("Products", "CategoryId", {
      type: Sequelize.INTEGER
    })

    await queryInterface.addConstraint("Products", {
      fields: ["CategoryId"],
      type: "foreign key",
      name: "category_id_fk",
      references: {
        table: "Categories",
        field: "id"
      },
      onDelete: "cascade",
      onUpdate: "cascade"
    })

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.removeConstraint("Products", "category_id_fk")
    await queryInterface.removeColumn("Products", "CategoryId")

  }
};
