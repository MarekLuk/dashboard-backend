const Todo = require("../models/todo");
const User = require('../models/user');
const logger = require('../utils/logger');
const { sequelize } = require('../config/db');
const { faker } = require('@faker-js/faker');

async function seedDatabase() {
    try {
        await sequelize.authenticate();
        logger.info('Connected to the database.');


        const user = await User.create({
            email: 'user@user.com',
            password: 'user',
            role: 'user'
        });
        logger.info(`Created user: ${user.email}`);

        const admin = await User.create({
            email: 'admin@admin.com',
            password: 'admin',
            role: 'admin'
        });
        logger.info(`Created admin user: ${admin.email}`);

        const todos = Array.from({ length: 12 }, () => {
            let title = faker.lorem.words(3).substring(0, 20).trim();
            if (title.length < 3) {
                title = title.padEnd(3, 'a');
            }
            let description = faker.lorem.sentence().substring(0, 50).trim();
            if (description.length < 5) {
                description = description.padEnd(5, 'a');
            }
            const userId = faker.number.int({ min: 1, max: 2 });

            return {
                title: title,
                description: description,
                isCompleted: faker.datatype.boolean(),
                userId: userId
            };
        });

        for (const todo of todos) {
            await Todo.create(todo);
            logger.info(`Created todo: ${todo.title}`);
            await new Promise(resolve => setTimeout(resolve, 10));

        }
        logger.info("Database seeded successfully!");
        process.exit(0);

    } catch (error) {
        logger.error("Error seeding database:", error);
        process.exit(1);
    }
}

seedDatabase();
