const Sequelize = require('sequelize');

const sequelize = require('../models/database');

const DownloadedURLS = sequelize.define('URLs', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  url: Sequelize.STRING,
  date:Sequelize.DATE,
});

module.exports = DownloadedURLS;