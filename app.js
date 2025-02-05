require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database'); 
const middleware = require('./app/middleware');
const router = express.Router();
const healthCheckRoutes = require('./routes/healthzRoutes');


const app = express();
const port = process.env.PORT || 8080;

app.disable('x-powered-by');


app.use('/', middleware, healthCheckRoutes);


const server = app.listen(port, () => {
  console.log(`App listening on the port ${port}`);
});


module.exports = {server}
