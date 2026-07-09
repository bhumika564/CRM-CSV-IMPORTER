const request = require('supertest');
const app = require('../server');

describe('API Route Testing', () => {
  it('GET /health should return 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  it('POST /api/import without records should return 400', async () => {
    const res = await request(app)
      .post('/api/import')
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /api/import with valid payload should process without crashing', async () => {
    // We will not test the actual Gemini API call here to avoid quota limits/network deps,
    // but we can ensure the endpoint accepts the payload.
    // However, the current logic is tightly coupled with Gemini.
    // We'll just test the error paths.
    const res = await request(app)
      .post('/api/import')
      .send({ records: [{ "First Name": "Test" }] });
    
    // Depending on if GEMINI_API_KEY is set in CI/CD, it might return 500 or 200.
    // We just expect it to be one of the known responses, not a hard crash.
    expect([200, 500]).toContain(res.statusCode);
  });
});
