const { HealthCheck } = require('../models/healthCheckModel');
const sequelize = require('../config/database');
const logger = require('../utils/logger')
const statsd = require('../utils/metics')
const calculatelife = require('../utils/calculateLifeDuration');



const performHealthCheck = async (req, res) => {
    statsd.increment('api.healthz.count');
    logger.info('Successfully Received a health check request');

    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('X-Content-Type-Options', 'nosniff');

    if (req.rawBody && req.rawBody.trim().length > 0) {
        logger.warn('Invalid request body received');
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('X-Content-Type-Options', 'nosniff');
        res.status(400).end();
        return;
    }
    if (Object.keys(req.query).length > 0) {
        logger.warn('Invalid query parameters received');
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('X-Content-Type-Options', 'nosniff');
        res.status(400).end();
        return;
    }

    try {
        logger.info('Attempting to authenticate with the database');
        await sequelize.authenticate();
        let inception = process.hrtime();
        logger.info('Health check passed, logging the success'); 
        await HealthCheck.create({ Datetime: new Date().toISOString() });
        statsd.timing(`insertRecord.duration`, calculatelife(inception));   


        
        return res.status(200).end();
    } catch (err) {
        logger.error('Health check failed: ' + err.message);
        return res.status(503).end();
    }
};


module.exports = {
    performHealthCheck,
};
