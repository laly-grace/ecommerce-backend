import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { app } from '../src/app.js';

describe('Products API', () => {
  it('should reject unauthenticated product creation', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .send({
        vendorId: 'd93bbb86-31ab-49d9-977b-f8b25e347d16',
        title: 'Test',
        priceCents: 1000,
      })
      .set('Accept', 'application/json');

    expect([401, 403]).toContain(res.status);
  });
});
