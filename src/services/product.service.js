import ProductRepository from '../repositories/product.repository.js';

export const createProductService = async (data) => ProductRepository.create(data);
export const getAllProductsService = async () => ProductRepository.getAll();
export const getProductByIdService = async (id) => ProductRepository.getById(id);
export const updateProductService = async (id, data) => ProductRepository.update(id, data);
export const deleteProductService = async (id) => ProductRepository.delete(id);
