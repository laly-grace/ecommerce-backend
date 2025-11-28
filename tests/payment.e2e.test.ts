import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { app } from '../src/app.js';
import { prisma } from '../src/db/prisma.js';
import { auth } from '../src/utils/auth.js';

describe('Payments E2E', () => {
  let user: any = null;
  let order: any = null;

  beforeEach(async () => {
    user = await prisma.user.create({
      data: { email: `pay+${Date.now()}@ex.com`, name: 'Pay User' },
    });
    // create a simple order for user
    order = await prisma.order.create({
      data: { customerId: user.id, totalCents: 1500 },
    });
    vi.spyOn((auth as any).api, 'getSession').mockImplementation(async () => ({
      user: { id: user.id },
    }));
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    if (order) {
      await prisma.payment.deleteMany({ where: { orderId: order.id } });
      await prisma.order.deleteMany({ where: { id: order.id } });
    }
    if (user) await prisma.user.deleteMany({ where: { id: user.id } });
  });

  it('creates a payment and processes webhook to mark paid and advance order', async () => {
    const payload = { orderId: order.id, method: 'CARD', amountCents: 1500 };
    const res = await request(app)
      .post('/api/v1/payments')
      .send(payload)
      .set('Accept', 'application/json');
    expect(res.status).toBe(201);
    const created = res.body?.data;
    expect(created).toBeTruthy();

    // simulate gateway webhook marking paid
    const webhook = {
      orderId: order.id,
      status: 'PAID',
      transactionRef: `tx-${Date.now()}`,
      gateway: 'stripe',
      amountCents: 1500,
    };
    const wres = await request(app)
      .post('/api/v1/payments/webhook')
      .send(webhook)
      .set('Accept', 'application/json');
    expect(wres.status).toBe(200);
    const updated = wres.body?.data;
    expect(updated.status).toBe('PAID');

    const dbOrder = await prisma.order.findUnique({ where: { id: order.id } });
    expect(dbOrder?.status).toBe('PROCESSING');
  });
});
