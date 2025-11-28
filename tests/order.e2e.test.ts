import request from 'supertest';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { app } from '../src/app.js';
import { prisma } from '../src/db/prisma.js';
import { auth } from '../src/utils/auth.js';

describe('Orders E2E', () => {
  let user: any = null;
  let otherUser: any = null;
  let seller: any = null;
  let vendor: any = null;
  let product: any = null;

  beforeEach(async () => {
    // seed a user and another user
    user = await prisma.user.create({
      data: { email: `order+${Date.now()}@example.com`, name: 'Order User' },
    });
    otherUser = await prisma.user.create({
      data: { email: `other+${Date.now()}@example.com`, name: 'Other User' },
    });

    // seller and vendor
    seller = await prisma.sellerProfile.create({
      data: {
        userId: user.id,
        displayName: 'Seller for Orders',
        slug: `seller-${Date.now()}`,
      },
    });
    vendor = await prisma.vendor.create({
      data: {
        sellerId: seller.id,
        name: 'Order Vendor',
        slug: `vendor-${Date.now()}`,
      },
    });

    // create a product for vendor
    product = await prisma.product.create({
      data: {
        vendorId: vendor.id,
        title: 'Order Product',
        slug: `order-product-${Date.now()}`,
        priceCents: 3000,
        stock: 10,
        images: [],
        categorySlugs: [],
      },
    });

    // mock session to return our user by default; tests will override as needed
    vi.spyOn((auth as any).api, 'getSession').mockImplementation(async () => ({
      user: { id: user.id },
    }));
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    // cleanup: delete order items then orders to avoid FK constraint violations
    if (user) {
      const orders = await prisma.order.findMany({
        where: { customerId: user.id },
        select: { id: true },
      });
      const orderIds = orders.map((o) => o.id);
      if (orderIds.length) {
        await prisma.orderItem.deleteMany({
          where: { orderId: { in: orderIds } },
        });
        await prisma.order.deleteMany({ where: { id: { in: orderIds } } });
      }
    }
    if (otherUser) {
      const orders = await prisma.order.findMany({
        where: { customerId: otherUser.id },
        select: { id: true },
      });
      const orderIds = orders.map((o) => o.id);
      if (orderIds.length) {
        await prisma.orderItem.deleteMany({
          where: { orderId: { in: orderIds } },
        });
        await prisma.order.deleteMany({ where: { id: { in: orderIds } } });
      }
    }
    if (product) await prisma.product.deleteMany({ where: { id: product.id } });
    if (vendor) await prisma.vendor.deleteMany({ where: { id: vendor.id } });
    if (seller)
      await prisma.sellerProfile.deleteMany({ where: { id: seller.id } });
    if (user) await prisma.user.deleteMany({ where: { id: user.id } });
    if (otherUser)
      await prisma.user.deleteMany({ where: { id: otherUser.id } });
  });

  it('creates an order for authenticated customer and persists items', async () => {
    const payload = {
      items: [
        {
          productId: product.id,
          vendorId: vendor.id,
          title: product.title,
          unitPriceCents: product.priceCents,
          quantity: 2,
        },
      ],
      totalCents: product.priceCents * 2,
    };

    const res = await request(app)
      .post('/api/v1/orders')
      .send(payload)
      .set('Accept', 'application/json');
    expect(res.status).toBe(201);
    const created = res.body?.data;
    expect(created).toBeTruthy();
    expect(created.items).toHaveLength(1);

    const dbOrder = await prisma.order.findUnique({
      where: { id: created.id },
      include: { items: true },
    });
    expect(dbOrder).not.toBeNull();
    expect(dbOrder?.totalCents).toBe(payload.totalCents);
    expect(dbOrder?.items[0].productId).toBe(product.id);
  });

  it('prevents non-owner from reading another user order', async () => {
    // first create an order as user
    const payload = {
      items: [
        {
          productId: product.id,
          vendorId: vendor.id,
          title: product.title,
          unitPriceCents: product.priceCents,
          quantity: 1,
        },
      ],
      totalCents: product.priceCents,
    };
    const createRes = await request(app)
      .post('/api/v1/orders')
      .send(payload)
      .set('Accept', 'application/json');
    expect(createRes.status).toBe(201);
    const orderId = createRes.body?.data?.id;

    // now mock session as otherUser and try to fetch the order
    (auth as any).api.getSession = async () => ({ user: { id: otherUser.id } });
    const fetchRes = await request(app)
      .get(`/api/v1/orders/${orderId}`)
      .set('Accept', 'application/json');
    // forbidden
    expect([401, 403]).toContain(fetchRes.status);
  });
});
