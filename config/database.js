require('dotenv').config();
const { Sequelize } = require('sequelize');
var sequelize;

if (process.env.ENV === 'test'){
   sequelize = new Sequelize(
    process.env.DB_NAME_TEST,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
    }
  );  
}
else{
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'mysql',
    }
  );
}




module.exports = sequelize;
