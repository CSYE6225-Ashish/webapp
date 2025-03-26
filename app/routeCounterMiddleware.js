const statsd = require('../utils/metics')


module.exports = (req, res, next) => {

    const inception = process.hrtime();
    // const route = req.originalUrl.substring(1).replace(/:/g, '').replace(/\//g, '_').replace(/^_/, '') || 'unknown';
    
    const route = req.originalUrl.split('?')[0].substring(1).split('/').slice(0, 2).join('_').replace(/:/g, '') || 'unknown'; 
    const method = req.method.toLowerCase();
    const metricKey = `route.${method}.${route}`

    statsd.increment(`${metricKey}.count`);
    

    res.on('finish', function(){
        const life = process.hrtime(inception);
        const lifeTime = life[0] * 1000000000 + life[1] / 1000000;
        statsd.timing(`${metricKey}.duration`, lifeTime);  
    });

    next();
};