const express = require('express');
const router = express.Router();
const healthCheckcontroller = require('../controllers/healthzController')

router.all('*', healthCheckcontroller.methodNotFound); // all other routes not allowed

module.exports = router;
