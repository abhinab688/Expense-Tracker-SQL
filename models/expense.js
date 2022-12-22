const Sequelize = require('sequelize');

const sequelize = require('../models/database');

const Expense = sequelize.define('expense', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  amount: Sequelize.INTEGER,
  description: Sequelize.STRING,
  category:Sequelize.STRING,
});

module.exports = Expense;