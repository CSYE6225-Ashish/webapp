const express = require('express');
const router = express.Router();
const healthCheckcontroller = require('../controllers/healthzController')

router.get('/healthz',healthCheckcontroller.performHealthCheck);
router.post('/healthz',healthCheckcontroller.unsupportedMethod);
router.put('/healthz',healthCheckcontroller.unsupportedMethod);
router.delete('/healthz',healthCheckcontroller.unsupportedMethod);
router.patch('/healthz',healthCheckcontroller.unsupportedMethod);
router.all('*', healthCheckcontroller.methodNotFound); // all other routes not allowed


module.exports = router;
