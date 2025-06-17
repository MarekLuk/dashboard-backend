require('dotenv').config();

const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [process.env.PROD_ORIGIN].filter(Boolean)
    : [process.env.DEV_ORIGIN].filter(Boolean);

module.exports = allowedOrigins;

