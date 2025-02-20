const { HealthCheck } = require('../models/healthCheckModel');
const sequelize = require('../config/database');

const performHealthCheck = async (req, res) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('X-Content-Type-Options', 'nosniff');

    if (req.rawBody && req.rawBody.trim().length > 0) {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('X-Content-Type-Options', 'nosniff');
        res.status(400).end();
        return;
    }
    if (Object.keys(req.query).length > 0) {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('X-Content-Type-Options', 'nosniff');
        res.status(400).end();
        return;
    }

    try {
        await sequelize.authenticate();
        await HealthCheck.create({ Datetime: new Date().toISOString() });

        return res.status(200).end();
    } catch (err) {
        console.log(err)
        return res.status(503).end();
    }
};

const unsupportedMethod = (req, res) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('X-Content-Type-Options', 'nosniff');
    res.status(405).end();
}

const methodNotFound = (req, res) => {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('X-Content-Type-Options', 'nosniff');
    res.status(404).end();
}
module.exports = {
    performHealthCheck,
    unsupportedMethod,
    methodNotFound,
};
