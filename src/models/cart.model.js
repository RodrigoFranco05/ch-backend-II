import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
});

const cartModel = mongoose.model('carts', cartSchema);
export default cartModel;