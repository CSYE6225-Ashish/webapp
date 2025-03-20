const express = require('express');
const router = express.Router();
const restrictedRoutesController = require('../controllers/restrictedRoutesController')

router.all('*', restrictedRoutesController.methodNotFound); // all other routes not allowed

module.exports = router;