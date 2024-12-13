const logger = require('../utils/logger');
const createDatabaseIfNotExists = require('../utils/createDatabase');
const { Client } = require("pg");

//mocking pg client
jest.mock('pg', () => {
    const mockClient = {
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn(),
    };
    return { Client: jest.fn(() => mockClient) };
});

//mocking logger
jest.mock('../utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
}));

describe('CreateDatabaseIfNotExists', () => {
    let mockClient;

    //check connection to the databse
    //close database connection
    const assertConnectionAndEndCalled = () => {
        expect(mockClient.connect).toHaveBeenCalled();
        expect(mockClient.end).toHaveBeenCalled();
    };
    //Function is called before each test. New mock client for ech test
    beforeEach(() => {
        mockClient = new Client();
    });
    //clear all mock after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Create the database if it does not exist', async () => {
        mockClient.query.mockResolvedValueOnce({ rowCount: 0 });
        await createDatabaseIfNotExists();

        assertConnectionAndEndCalled();

        //check if the databse exist
        expect(mockClient.query).toHaveBeenCalledWith(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [process.env.DB_NAME]
        );
        //create database
        expect(mockClient.query).toHaveBeenCalledWith(
            `CREATE DATABASE "${process.env.DB_NAME}"`
        );
        //message
        expect(logger.info).toHaveBeenCalledWith(
            `Database "${process.env.DB_NAME}" created successfully.`
        );
    });

    it('Not create the database if it already exists', async () => {
        // Simulate the case where the database already exists (rowCount: 1)
        mockClient.query.mockResolvedValueOnce({ rowCount: 1 });

        await createDatabaseIfNotExists();

        assertConnectionAndEndCalled();   

        expect(mockClient.query).toHaveBeenCalledWith(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [process.env.DB_NAME]
        );
       
        expect(mockClient.query).not.toHaveBeenCalledWith(
            `CREATE DATABASE "${process.env.DB_NAME}"`
        );
        expect(logger.info).toHaveBeenCalledWith(
            `Database "${process.env.DB_NAME}" already exists.`
        );
       
    });

    it('Log an error if an error occurs', async () => {
         // Simulate a connection failure
        const error = new Error('Connection failed');
        mockClient.connect.mockRejectedValueOnce(error);
        await createDatabaseIfNotExists();

        assertConnectionAndEndCalled();   

        expect(logger.error).toHaveBeenCalledWith('Error creating database:', error.stack);       

    });
});
