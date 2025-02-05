const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HealthCheck = sequelize.define(
  'health_check_table',
  {
    check_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Datetime: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    timestamps: false,
    tableName: 'health_check_table',
  },
  

);

module.exports = {HealthCheck} ;
