import * as repo from '../repositories/sellerRepository.js';
import type {
  CreateSellerDtoType,
  UpdateSellerDtoType,
} from '../dtos/seller.dto.js';

export const createSellerProfile = async (data: CreateSellerDtoType) => {
  return repo.createSellerProfile(data);
};

export const getSellerById = async (id: string) => repo.findSellerById(id);

export const getSellerByUserId = async (userId: string) =>
  repo.findSellerByUserId(userId);

export const updateSellerProfile = async (
  id: string,
  data: UpdateSellerDtoType,
) => repo.updateSellerProfile(id, data);

export const deleteSellerProfile = async (id: string) =>
  repo.deleteSellerProfile(id);
