'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
    'Users',
    [
      {
        name: 'Kate Le',
        email: 'kate@hydra.com',
        phone: '12345',
        birthdate: '1980-10-10',
        gender: 'Unknown',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Phat Pham',
        email: 'phatpd@hydra.com',
        phone: '12345',
        birthdate: '1980-10-10',
        gender: 'Unknown',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {}),
};
