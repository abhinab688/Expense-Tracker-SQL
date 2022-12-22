const Sequelize = require('sequelize');

const sequelize = require('../models/database');

const Orders = sequelize.define('orders', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  paymentid: Sequelize.STRING,
  orderid: Sequelize.STRING,
  status:Sequelize.STRING,
});

module.exports = Orders;