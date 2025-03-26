const { File } = require('../models/File-Model');
const sequelize = require('../config/database');
const { S3Client, PutObjectCommand, HeadObjectCommand, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { where } = require('sequelize');
const logger = require('../utils/logger')
const statsd = require('../utils/metics')
const calculatelife = require('../utils/calculateLifeDuration')
const upload = multer({ storage: multer.memoryStorage() }).single("file");
const s3Bucket = process.env.S3_BUCKET

const s3Client = new S3Client({
    region: 'us-east-1',
  });

  const uploadFiletoS3 = async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (!req.file) {
          logger.warn('No file uploaded in the request');
          return res.status(400).end();
        }
        
        if (err) {
          logger.error('Error processing file:', err);
          return res.status(400).end();
        }
  
        try {
          // File upload and metadata retrieval
          const key = uuidv4();
          const s3Key = `${key}/${req.file.originalname}`;
          logger.info(`Uploading ${req.file.originalname} to S3 Bucket ${s3Bucket}.....`)
          let inception = process.hrtime();
          await s3Client.send(new PutObjectCommand({
            Bucket: s3Bucket,
            Key: s3Key,
            Body: req.file.buffer
          }));
          logger.info(`Uploaded ${req.file.originalname} to S3 Bucket ${s3Bucket} Successfully!`)
  
          const headResponse = await s3Client.send(new HeadObjectCommand({
            Bucket: s3Bucket,
            Key: s3Key
          }));
          statsd.timing(`fileUpload.duration`, calculatelife(inception)); 
  
          // Database operations
          logger.info(`Inserting values to database`)
          inception = process.hrtime();
          await sequelize.authenticate();
          const fileRecord = await File.create({
            file_name: req.file.originalname,
            id: key,
            url: `${s3Bucket}/${s3Key}`,
            upload_date: headResponse.LastModified.toISOString().split("T0")[0]
          });
          logger.info(`Successfully inserted values to database`)
          statsd.timing(`insertRecord.duration`, calculatelife(inception));
        
          // Single response point
          res.status(201).json({
            file_name: fileRecord.file_name,
            id: fileRecord.id,
            url: fileRecord.url,
            upload_date: fileRecord.upload_date
          });
          logger.info(`Upload operation loop successfully completed!`)
        
        } catch (uploadErr) {
          if (!res.headersSent) {
            res.status(400).end();
          }
          logger.error(`An upload error occured, ${uploadErr}`);
        }
      });

    } catch (err) {
      if (!res.headersSent) {
        res.status(400).end();
        logger.warn(`No headers passed or no upload file present in the request`)
      }
      logger.error(`Upload failed due to error ${err}`);
    }
  };

  const deleteFile = async (req, res) => {
    try {
      let inception = process.hrtime();
      const { id } = req.params;

      // 1. Find database record
      logger.info(`Finding record ${id} to delete`)
      const fileRecord = await File.findByPk(id);
      statsd.timing(`retrieveRecord.duration`, calculatelife(inception));
      if (!fileRecord) {
        return res.status(404).end();
      }
  
      // 2. Delete all S3 objects with matching prefix
      logger.info(`Deleteing key:${id} and all files in it`)
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
        statsd.timing(`deleteObjectS3.duration`, calculatelife(inception));
        logger.info(`Deleted key:${id} and all files in it`)
      }
  
      // 3. Delete database record
      inception = process.hrtime();
      logger.info(`Deleting record for ${id} from database...`)
      statsd.timing(`deleteRecord.duration`, calculatelife(inception));
      await fileRecord.destroy();

      logger.info(`Deleted record for ${id} from database`)
  
      // 4. Return deleted record in specified format
      res.status(204).end();
      logger.info(`Delete file loop completed Successfully`)
    } catch (error) {
      console.error('Delete error:', error);
      if (!res.headersSent) {
        logger.error(`Delete failed due to error ${error}`)
        res.status(404);
      }
    }
  };

  const getFile = async(req,res)=>{
    
    const {id} = req.params;
    logger.info(`Fetching info for ${id} from database....`)
    try{
      let inception = process.hrtime();

      const fileRecord = await File.findByPk(id);
      statsd.timing(`retrieveRecord.duration`, calculatelife(inception));
      
      res.status(200).json({
      file_name: fileRecord.file_name,
      id: fileRecord.id,
      url: fileRecord.url,
      upload_date: fileRecord.upload_date
    })

    }catch (error) {
      res.status(404).end();
      logger.error(`Record not found!`)
    }
    
  }
module.exports = {
  uploadFiletoS3,
  deleteFile,
  getFile
};
