const express = require('express');
const router = express.Router();
const healthCheckcontroller = require('../controllers/healthzController')
const restrictedRoutesController = require('../controllers/restrictedRoutesController')

//restricted routes
router.post('/',restrictedRoutesController.unsupportedMethod);
router.put('/',restrictedRoutesController.unsupportedMethod);
router.delete('/',restrictedRoutesController.unsupportedMethod);
router.head('/',restrictedRoutesController.unsupportedMethod);
router.options('/',restrictedRoutesController.unsupportedMethod);
router.patch('/',restrictedRoutesController.unsupportedMethod);


router.get('/',healthCheckcontroller.performHealthCheck);



router.all('/*', restrictedRoutesController.methodNotFound); // all other routes not allowed


module.exports = router;
