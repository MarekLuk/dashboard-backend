# Todo App Backend

## Summary

This project implements a backend service for a Todo application using Node.js and Express. It provides a REST API for managing todo items stored in a PostgreSQL database. The primary purpose of this service is to allow users to create, retrieve, update, and delete todo items via HTTP requests, making it suitable for integration with various frontend technologies.

## Features

- **Create Todo:** Allows the addition of new todo items.
- **List Todos:** Retrieves all todo items from the database.
- **Update Todo:** Updates the details of an existing todo item.
- **Delete Todo:** Removes a todo item from the database.

## Dependencies

- **Node.js**: Version 22.8.0
- **PostgreSQL**: Version 12.0 or higher
- **NPM Packages**:
  - `express`: For setting up the server
  - `sequelize`: ORM to interact with PostgreSQL
  - `pg`, `pg-hstore`: PostgreSQL client and serialization support for handling PostgreSQL-specific types.
  - `dotenv`: To manage environment variables
  - `joi`: For data validation
  - `cors`: Middleware for enabling cross-origin requests.
  - `winston`: For logging various levels of messages (info, warning, error).
  - `express-rate-limit`: To limit repeated requests to public APIs and protect against brute-force attacks.
  - `helmet`: Secure Express apps by setting various HTTP headers.
  - `sanitize-html`: For sanitizing user input and preventing XSS attacks.
  - `faker`: For seeding data.

## Getting Started

### Prerequisites

1. Ensure that Node.js and PostgreSQL are installed on your system.
2. The PostgreSQL user must have the `CREATEDB` privilege to create databases. Execute the following SQL command to grant this privilege:

- `ALTER USER your_user_name CREATEDB`

## Setup Instructions

### 1. Clone the Repository:

`git clone https://github.com/MarekLuk/todo-app-backend.git`

### 2. Navigate into the project directory:

`cd todo-app-backend`

### 3. Install Dependencies:

`npm install`

### 4. Environment Setup: Create a .env file in the root directory and populate it with the necessary environment variables:

- `DB_HOST=localhost`
- `DB_USER=your_username`
- `DB_PASSWORD=your_password`
- `DB_NAME=your_database_name`
- `DB_PORT=0000`
- `PORT=0000`
- `NODE_ENV=development`
- `DEV_ORIGIN=`
- `PROD_ORIGIN=`

### 5. Start the server

- `npm run dev`
- This command starts the server on http://localhost:5000/. You can now begin making HTTP requests to your API endpoints.

### 6. Seed database with data

- `npm run seed`

### 7. Test

- `npm run test`: for running tests
- `npm run coverage`: for generating a code coverage report
