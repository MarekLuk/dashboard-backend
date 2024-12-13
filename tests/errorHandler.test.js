const request = require('supertest');
const express = require('express');
const logger = require('../utils/logger');
const errorHandler = require('../utils/errorHandler');

jest.mock('../utils/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
}));

describe('Error Handler Middleware', () => {
    let app;
    const originalEnv = process.env;

    
    beforeEach(() => {
        app = express();
        app.get('/error', (req, res) => {
            throw new Error('Test error');
        });
        app.use(errorHandler);
    });

    it('Return the error message in development environment', async () => {
        process.env.NODE_ENV = 'development';
        const res = await request(app).get('/error');
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toBe('Test error');
        expect(logger.error).toHaveBeenCalled();
    });

    it('Return the error message in production environment', async () => {
        process.env.NODE_ENV = 'production';
        const res = await request(app).get('/error');
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toBe('An unexpected error occurred.');
        expect(logger.error).toHaveBeenCalled();
    });
});