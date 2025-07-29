import cartModel from '../../models/cart.model.js';

const cartDao = {
  createCart: async () => {
    return await cartModel.create({ products: [] });
  },

  getCartById: async (id) => {
    return await cartModel.findById(id);
  },
  getCartByIdWithPopulate: async (id) => {
    return await cartModel.findById(id).populate('products.product');;
  }

};

export default cartDao;
