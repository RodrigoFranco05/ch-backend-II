import * as ProductDAO from './daos/product.dao.js';

export default {
  create: ProductDAO.createProduct,
  getAll: ProductDAO.getAllProducts,
  getById: ProductDAO.getProductById,
  update: ProductDAO.updateProduct,
  delete: ProductDAO.deleteProduct
};
