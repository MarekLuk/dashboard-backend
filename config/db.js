const { Sequelize } = require("sequelize");
require("dotenv").config();
const createDatabaseIfNotExists = require("../utils/createDatabase");

// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
//     host: process.env.DB_HOST,
//     dialect: "postgres",
//     logging: false,
// });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: "postgres",
	logging: false,
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false,
		},
	},
});

module.exports = { sequelize, createDatabaseIfNotExists };
