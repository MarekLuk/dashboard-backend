const { sequelize, createDatabaseIfNotExists } = require("./config/db");
const logger = require('./utils/logger');
const app=require("./app");
const retryMechanism=require("./utils/retryMechanism");
require('dotenv').config();

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await createDatabaseIfNotExists();
        logger.info('Connecting to the database...');
        
        await retryMechanism(async () => {
            await sequelize.authenticate();
            logger.info('Connection has been established successfully.');
        }, 4, 2000);
        logger.info('Synchronizing database...');
        await sequelize.sync();
        logger.info('Database synchronized');
        const startServerOperation = async () => {
            return new Promise((resolve, reject) => {
                try {
                    logger.info('Starting server...');
                    app.listen(PORT, () => {
                      
                        logger.info(`Server running on port ${PORT}`);
                        resolve();
                    });
                } catch (err) {
                    reject(err);
                }
            });
        };
        await retryMechanism(startServerOperation, 3, 2000);
    } catch (error) {
        logger.error('Failed to start the server: %s', error.stack);
        process.exit(1);
    }
}
startServer();



