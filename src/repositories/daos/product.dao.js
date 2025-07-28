import ProductModel from '../../models/product.model.js';

export const createProduct = async (data) => await ProductModel.create(data);
export const getAllProducts = async () => await ProductModel.find().lean();
export const getProductById = async (id) => await ProductModel.findById(id);
export const updateProduct = async (id, data) => await ProductModel.findByIdAndUpdate(id, data, { new: true });
export const deleteProduct = async (id) => await ProductModel.findByIdAndDelete(id);
