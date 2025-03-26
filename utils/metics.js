const StatsD = require('hot-shots');
const logger = require('./logger');


const statsd = new StatsD({
    host: 'localhost',
    port: 8125,
    prefix: 'webapp.',
    errorHandler: (err) => logger.error('StatsD Error:', err)
});


module.exports = statsd;