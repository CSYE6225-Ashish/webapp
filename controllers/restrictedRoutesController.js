const logger = require('../utils/logger')


const unsupportedMethod = (req, res) => {
    
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('X-Content-Type-Options', 'nosniff');
    logger.info(`${req.method.toLowerCase()} method not supported`)
    res.status(405).end();
}

const methodNotFound = (req, res) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('X-Content-Type-Options', 'nosniff');
    logger.info(`${req.method.toLowerCase()} method not found`)
    res.status(404).end();
}


const badRequrest = (req, res)=>{
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('X-Content-Type-Options', 'nosniff');
    logger.info(`${req.method.toLowerCase()} Bad request`)
    res.status(400).end();
}

const methodNotAllowed = (req, res)=>{
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('X-Content-Type-Options', 'nosniff');
    logger.info(`${req.method.toLowerCase()} method not allowed`)
    res.status(405).end();
}

module.exports = {
    unsupportedMethod,
    methodNotFound,
    badRequrest,
    methodNotAllowed,
};