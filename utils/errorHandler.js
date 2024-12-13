const logger = require('../utils/logger');
require('dotenv').config();

const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);
    const statusCode = err.statusCode || 500;
    let message = err.message;
    if (process.env.NODE_ENV === 'production') {
        message = 'An unexpected error occurred.';
    }
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};

module.exports = errorHandler;
