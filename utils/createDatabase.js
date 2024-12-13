const { Client } = require("pg");
const logger = require('./logger');
require('dotenv').config();

async function createDatabaseIfNotExists() {
    logger.info('Creating database if it does not exist...');
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: 'postgres',
    });

    try {
        await client.connect();
        const res = await client.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [process.env.DB_NAME]
        );
        if (res.rowCount === 0) {
            await client.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
            logger.info(`Database "${process.env.DB_NAME}" created successfully.`);

        } else {
            logger.info(`Database "${process.env.DB_NAME}" already exists.`);
        }
    } catch (error) {
        logger.error("Error creating database:", error.stack || error.message || error);
    }
    finally {
        await client.end();
    }
}

module.exports = createDatabaseIfNotExists; 
