const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');
const UserModel = require('../model/User');

const timestamp = Date.now();
const testUser = {
    name: 'Test User',
    username: `testuser_${ timestamp}`,
    email: `test_${ timestamp }@example.com`,
    avatar: '',
    isVerified: true
};

describe('User API Tests', () => {
    beforeAll(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI || '', {});
        }
    });

    afterAll(async () => {
        await UserModel.deleteOne({ email: testUser.email });

        await mongoose.connection.close();
    });

    it('Save user (POST /api/user/save-user-in-mongo)', async () => {
        const res = await request(app)
            .post('/api/user/save-user-in-mongo')
            .send(testUser);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
    });

    it('Get user by email (GET /api/user/get-user-by-email)', async () => {
        const res = await request(app)
            .get('/api/user/get-user-by-email')
            .query({ email: testUser.email });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.user.email).toBe(testUser.email);
    });
});
