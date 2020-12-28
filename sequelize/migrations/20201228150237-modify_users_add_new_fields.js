'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn(
      'Users', // table name
      'password', // new field name
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
    )
  },

  down: async (queryInterface, Sequelize) => {}
};
