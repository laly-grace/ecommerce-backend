import { prisma } from '../db/prisma.js';
import type {
  CreateCartDtoType,
  AddCartItemDtoType,
  UpdateCartItemDtoType,
} from '../dtos/cart.dto.js';

export const createCart = async (data: CreateCartDtoType) => {
  const prismaData: any = {};
  if (data.userId !== undefined) prismaData.userId = data.userId;
  if (data.sessionId !== undefined) prismaData.sessionId = data.sessionId;
  const rec = await prisma.cart.create({ data: prismaData });
  return rec;
};

export const findCartById = async (id: string) =>
  prisma.cart.findUnique({ where: { id }, include: { items: true } });

export const findCartByUserId = async (userId: string) =>
  prisma.cart.findFirst({ where: { userId }, include: { items: true } });

export const addItem = async (cartId: string, data: AddCartItemDtoType) => {
  const rec = await prisma.cartItem.create({
    data: {
      cartId,
      productId: data.productId,
      title: data.title,
      unitPriceCents: data.unitPriceCents,
      quantity: data.quantity,
      image: data.image ?? null,
      variantSku: data.variantSku ?? null,
    },
  });
  return rec;
};

export const updateItem = async (id: string, data: UpdateCartItemDtoType) =>
  prisma.cartItem.update({ where: { id }, data: { quantity: data.quantity } });

export const removeItem = async (id: string) =>
  prisma.cartItem.delete({ where: { id } });

export const deleteCart = async (id: string) => {
  // remove items then cart
  await prisma.cartItem.deleteMany({ where: { cartId: id } });
  return prisma.cart.delete({ where: { id } });
};
