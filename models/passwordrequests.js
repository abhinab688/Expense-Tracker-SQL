const Sequelize = require('sequelize');

const sequelize = require('../models/database');

const passwordReset = sequelize.define('PasswordReset', {
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true
  },
  Active:Sequelize.BOOLEAN,
  expiresby:Sequelize.DATE
});

module.exports = passwordReset;