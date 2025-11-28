import { prisma } from '../db/prisma.js';
import type {
  CreatePaymentDtoType,
  UpdatePaymentDtoType,
} from '../dtos/payment.dto.js';

export const createPayment = async (data: CreatePaymentDtoType) =>
  prisma.payment.create({ data: { ...data, status: 'PENDING' } as any });

export const findPaymentById = async (id: string) =>
  prisma.payment.findUnique({ where: { id } });

export const findPaymentByOrderId = async (orderId: string) =>
  prisma.payment.findUnique({ where: { orderId } });

export const updatePayment = async (id: string, data: UpdatePaymentDtoType) =>
  prisma.payment.update({ where: { id }, data: { ...data } as any });

export const deletePayment = async (id: string) =>
  prisma.payment.delete({ where: { id } });
