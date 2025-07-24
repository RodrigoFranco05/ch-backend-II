import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  products: [
    {
      productId: String,
      quantity: Number
    }
  ]
});

const cartModel = mongoose.model('carts', cartSchema);
export default cartModel;