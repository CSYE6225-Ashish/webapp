const express = require('express');
const router = express.Router();
const fileUploadController = require('../controllers/fileUploadController')
const restrictedRoutesController = require('../controllers/restrictedRoutesController')
const routeCounterMiddleware = require('../app/routeCounterMiddleware');

// Get metrics for each route
router.use(routeCounterMiddleware);


//restricted routes
router.head('/',restrictedRoutesController.unsupportedMethod);
router.options('/',restrictedRoutesController.unsupportedMethod);
router.patch('/',restrictedRoutesController.unsupportedMethod);
router.put('/',restrictedRoutesController.unsupportedMethod);

router.head('/:id',restrictedRoutesController.unsupportedMethod);
router.options('/:id',restrictedRoutesController.unsupportedMethod);
router.patch('/:id',restrictedRoutesController.unsupportedMethod);
router.put('/:id',restrictedRoutesController.unsupportedMethod);

router.post('/:id',restrictedRoutesController.methodNotAllowed);
router.delete('/',restrictedRoutesController.badRequrest);


// allowed routes
router.post('/',fileUploadController.uploadFiletoS3);
router.get('/:id',fileUploadController.getFile);
router.delete('/:id',fileUploadController.deleteFile);
router.get('/',restrictedRoutesController.badRequrest);
router.delete('/',restrictedRoutesController.badRequrest);


module.exports = router;
