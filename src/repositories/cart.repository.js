import cartDao from './daos/cart.dao.js';

class CartRepository {
  async createCart() {
    return await cartDao.createCart();
  }

  async getCartById(id) {
    return await cartDao.getCartById(id);
  }
}

export default new CartRepository();
