import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  precio: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);