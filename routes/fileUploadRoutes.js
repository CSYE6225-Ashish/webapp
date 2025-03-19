const express = require('express');
const router = express.Router();
const fileUploadController = require('../controllers/fileUploadController')

// allowed routes
router.post('/',fileUploadController.uploadFiletoS3);
router.get('/:id',fileUploadController.getFile);
router.delete('/:id',fileUploadController.deleteFile);



module.exports = router;
