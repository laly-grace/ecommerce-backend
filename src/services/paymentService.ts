import * as repo from '../repositories/paymentRepository.js';
import * as orderRepo from '../repositories/orderRepository.js';
import type {
  CreatePaymentDtoType,
  UpdatePaymentDtoType,
  WebhookPaymentDtoType,
} from '../dtos/payment.dto.js';

export const createPayment = async (data: CreatePaymentDtoType) =>
  repo.createPayment(data);

export const getPaymentById = async (id: string) => repo.findPaymentById(id);

export const getPaymentByOrderId = async (orderId: string) =>
  repo.findPaymentByOrderId(orderId);

export const updatePayment = async (id: string, data: UpdatePaymentDtoType) =>
  repo.updatePayment(id, data);

export const handleWebhook = async (payload: WebhookPaymentDtoType) => {
  // Map webhook status to internal payment update; create payment if missing
  let payment = await repo.findPaymentByOrderId(payload.orderId as string);
  if (!payment) {
    // create a payment record representing the gateway event
    payment = await repo.createPayment({
      orderId: payload.orderId,
      method: (payload.gateway ? 'CARD' : 'CARD') as any,
      amountCents: payload.amountCents ?? 0,
      currency: 'USD',
      gateway: payload.gateway ?? null,
      transactionRef: payload.transactionRef ?? null,
    } as any);
  }

  const updated = await repo.updatePayment(payment.id, {
    status: payload.status,
    transactionRef: payload.transactionRef,
    gateway: payload.gateway,
  } as UpdatePaymentDtoType);

  // if paid, advance order status to PROCESSING
  if (payload.status === 'PAID') {
    await orderRepo.updateOrder(payment.orderId, {
      status: 'PROCESSING',
    } as any);
  }

  return updated;
};
