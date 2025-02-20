const { Client } = require("pg");
const logger = require("./logger");
require("dotenv").config();

// async function createDatabaseIfNotExists() {
// 	const client = new Client({
// 		user: process.env.DB_USER,
// 		host: process.env.DB_HOST,
// 		password: process.env.DB_PASSWORD,
// 		port: process.env.DB_PORT,
// 		database: "postgres",
// 	});

async function createDatabaseIfNotExists() {
	const connectionString = process.env.DATABASE_URL;
	const client = new Client({
		connectionString,
		ssl: { rejectUnauthorized: false }, // Enable SSL if required by Render
		database: "postgres", // Connect to the maintenance database to check for creation
	});
	try {
		await client.connect();
		logger.info("Connected to PostgreSQL maintenance database.");
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
		logger.error(
			"Error creating database:",
			error.stack || error.message || error
		);
	} finally {
		await client.end();
	}
}

module.exports = createDatabaseIfNotExists;
