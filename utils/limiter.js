const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 500,
});

module.exports = generalLimiter;
