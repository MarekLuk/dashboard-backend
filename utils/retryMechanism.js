const logger = require('../utils/logger');

async function retryMechanism(operation, retries, delay) {
    for (let index = 0; index <= retries; index++) {
        try {
            return await operation()
        } catch (error) {
            if (index === retries) {
                logger.error('Last attempt', error);
            }
            logger.warn(`Attempt ${index + 1} failed. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

module.exports = retryMechanism;
