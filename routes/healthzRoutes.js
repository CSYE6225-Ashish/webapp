const express = require('express');
const router = express.Router();
const healthCheckcontroller = require('../controllers/healthzController')

router.get('/',healthCheckcontroller.performHealthCheck);
router.post('/',healthCheckcontroller.unsupportedMethod);
router.put('/',healthCheckcontroller.unsupportedMethod);
router.delete('/',healthCheckcontroller.unsupportedMethod);
router.patch('/',healthCheckcontroller.unsupportedMethod);
router.all('/*', healthCheckcontroller.methodNotFound); // all other routes not allowed


module.exports = router;
