const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const File = sequelize.define(
  'File',
  {
    file_name: {
        type: DataTypes.STRING,
        readOnly: true

      },
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      readOnly: true

    },
    url: {
        type: DataTypes.STRING,
        readOnly: true

      },
    upload_date: {
      type: DataTypes.STRING,
      readOnly: true

    },
  },
  {
    timestamps: false,
    tableName: 'File',
  },
  

);

module.exports = {File};
