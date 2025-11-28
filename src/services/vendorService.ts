import * as repo from '../repositories/vendorRepository.js';
import type {
  CreateVendorDtoType,
  UpdateVendorDtoType,
} from '../dtos/vendor.dto.js';

export const createVendor = async (data: CreateVendorDtoType) =>
  repo.createVendor(data);

export const getVendorById = async (id: string) => repo.findVendorById(id);

export const listVendors = async () => repo.findVendors();

export const updateVendor = async (id: string, data: UpdateVendorDtoType) =>
  repo.updateVendor(id, data);

export const deleteVendor = async (id: string) => repo.deleteVendor(id);
