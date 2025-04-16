require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database'); 
const middleware = require('./app/middleware');
const router = express.Router();
const healthCheckRoutes = require('./routes/healthzRoutes');
const notAllowedRoutes = require('./routes/notAllowedRoutes')
const fileUploadRoutes = require('./routes/fileUploadRoutes');
const app = express();
const port = process.env.PORT || 8080;

app.disable('x-powered-by');

sequelize.sync().then(
  () => {
      console.log("DB sync")
  }).catch(
  (err) => {
      console.log(err)
      console.log("Sync failed!")
  })


app.use('/healthz', middleware, healthCheckRoutes);
app.use('/cicd', middleware, healthCheckRoutes);
app.use('/v1/file',fileUploadRoutes);
app.use('/*',middleware,notAllowedRoutes);

const server = app.listen(port, () => {
  console.log(`App listening on the port ${port}`);
  
  
});


module.exports = {server}
