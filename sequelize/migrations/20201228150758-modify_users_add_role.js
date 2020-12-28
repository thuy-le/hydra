'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Users',
      'role',
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
    )
  },

  down: async (queryInterface, Sequelize) => {}
};
