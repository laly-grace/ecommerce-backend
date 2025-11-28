import * as repo from '../repositories/cartRepository.js';
import type {
  CreateCartDtoType,
  AddCartItemDtoType,
  UpdateCartItemDtoType,
} from '../dtos/cart.dto.js';

export const createCart = async (data: CreateCartDtoType) =>
  repo.createCart(data);

export const getCartById = async (id: string) => repo.findCartById(id);

export const getCartByUserId = async (userId: string) =>
  repo.findCartByUserId(userId);

export const addItemToCart = async (cartId: string, data: AddCartItemDtoType) =>
  repo.addItem(cartId, data);

export const updateCartItem = async (
  itemId: string,
  data: UpdateCartItemDtoType,
) => repo.updateItem(itemId, data);

export const removeCartItem = async (itemId: string) => repo.removeItem(itemId);

export const deleteCart = async (id: string) => repo.deleteCart(id);
