const request = require('supertest');
const { HealthCheck } = require('../models/healthCheckModel');
const sequelize = require('../config/database');
const { app , server } = require('../app');

beforeAll(async () => {
    try {
        await sequelize.sync({ force: true });
    } catch (err) {
        console.log(err);

    }

});

afterAll(async () => {
    // Close database connection after tests
    await sequelize.close();
    server.close();
});


describe('Health Check API Tests', () => {

    test('GET /healthz should return 200 OK and insert a record', async () => {
        // get initial count
        const initialCount = await HealthCheck.count();

        const response = await request(server).get('/healthz');
        expect(response.status).toBe(201);

        // Verify that a record was inserted
        const newCount = await HealthCheck.count();
        expect(newCount).toBe(initialCount + 1);
    });

    //Check for post
    test('POST /healthz should return 405 Method not allowed', async () => {
        const response = await request(server).post('/healthz');
        expect(response.status).toBe(405);

    });
    //Check for PUT
    test('PUT /healthz should return 405 Method not allowed', async () => {
        const response = await request(server).put('/healthz');
        expect(response.status).toBe(405);

    });
    //Check for DELETE
    test('DELETE /healthz should return 405 Method not allowed', async () => {
        const response = await request(server).delete('/healthz');
        expect(response.status).toBe(405);

    });

    //Check for payloads and params

    test('GET /healthz with payload should return 400 Bad Request', async () => {
        const response = await request(server)
            .get('/healthz')
            .send({ invalid: 'payload' });

        expect(response.status).toBe(400);
    });
    test('GET /healthz with query parameters should return 400 Bad Request', async () => {
        const response = await request(server).get('/healthz?param=value');
        expect(response.status).toBe(400);
    });

    // Check for if database is not connected
    test('Database failure should return 503 Service Unavailable', async () => {
        jest.spyOn(HealthCheck, 'create').mockRejectedValue(new Error('Database error'));
        const response = await request(server).get('/healthz');
        expect(response.status).toBe(503);
        HealthCheck.create.mockRestore();

    });
    
    //test if any other routes returns 404

    test('GET /any/other/routes return 404', async () => {
        const response = await request(server).delete('/any/other/route');
        expect(response.status).toBe(404);

    });

    

});
