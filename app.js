require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database'); 


const app = express();
const port = process.env.PORT || 8080;

sequelize.authenticate().then(() => {
    console.log('Connection to database has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
 });
 

app.listen(port, () => {
  console.log(`App listening on the port ${port}`);
});

