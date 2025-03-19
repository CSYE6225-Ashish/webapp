const { File } = require('../models/File-Model');
const sequelize = require('../config/database');
const { S3Client, PutObjectCommand, HeadObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { where } = require('sequelize');

const upload = multer({ storage: multer.memoryStorage() }).single("file");
const s3Bucket = process.env.S3_BUCKET

const s3Client = new S3Client({
    region: 'us-east-1',
  });

  const uploadFiletoS3 = async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (!req.file) {
          return res.status(400).send('No file uploaded');
        }
        
        if (err) {
          console.error('Error processing file:', err);
          return res.status(500).send('Error processing file');
        }
  
        try {
          // File upload and metadata retrieval
          const key = uuidv4();
          const s3Key = `${key}/${req.file.originalname}`;
          
          await s3Client.send(new PutObjectCommand({
            Bucket: s3Bucket,
            Key: s3Key,
            Body: req.file.buffer
          }));
  
          const headResponse = await s3Client.send(new HeadObjectCommand({
            Bucket: s3Bucket,
            Key: s3Key
          }));
  
          // Database operations
          await sequelize.authenticate();
          const fileRecord = await File.create({
            file_name: req.file.originalname,
            id: key,
            url: `${s3Bucket}/${s3Key}`,
            upload_date: headResponse.LastModified.toISOString().split("T0")[0]
          });
  
          // Single response point
          res.status(200).json({
            file_name: fileRecord.file_name,
            id: fileRecord.id,
            url: fileRecord.url,
            upload_date: fileRecord.upload_date
          });
        } catch (uploadErr) {
          if (!res.headersSent) {
            res.status(400);
          }
          console.error('Error:', uploadErr);
        }
      });
    } catch (err) {
      if (!res.headersSent) {
        res.status(400);
      }
      console.error('Unexpected error:', err);
    }
  };

  const deleteFile = async (req, res) => {
    try {
      const { id } = req.params;
  
      // 1. Find database record
      const fileRecord = await File.findByPk(id);
      if (!fileRecord) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      // 2. Delete all S3 objects with matching prefix
      const listParams = {
        Bucket: s3Bucket,
        Prefix: `${id}/`
      };
  
      const listedObjects = await s3Client.send(new ListObjectsV2Command(listParams));
      
      if (listedObjects.Contents?.length > 0) {
        const deleteParams = {
          Bucket: s3Bucket,
          Delete: {
            Objects: listedObjects.Contents.map(({ Key }) => ({ Key }))
          }
        };
        await s3Client.send(new DeleteObjectsCommand(deleteParams));
      }
  
      // 3. Delete database record
      await fileRecord.destroy();
  
      // 4. Return deleted record in specified format
      res.status(200).json({
        file_name: fileRecord.file_name,
        id: fileRecord.id,
        url: fileRecord.url,
        upload_date: fileRecord.upload_date
      });
  
    } catch (error) {
      console.error('Delete error:', error);
      if (!res.headersSent) {
        res.status(404);
      }
    }
  };

  const getFile = async(req,res)=>{
    const {id} = req.params;
    try{
      const fileRecord = await File.findByPk(id);
      res.status(200).json({
      file_name: fileRecord.file_name,
      id: fileRecord.id,
      url: fileRecord.url,
      upload_date: fileRecord.upload_date
    })

    }catch (error) {
      res.status(404)
    }
    
  }
  

module.exports = {
  uploadFiletoS3,
  deleteFile,
  getFile
};
