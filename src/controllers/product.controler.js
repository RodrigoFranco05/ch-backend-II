import {
  createProductService,
  getAllProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService
} from '../services/product.service.js';
import mongoose from 'mongoose';
import cartModel from '../models/cart.model.js';
import { sendTicketEmail } from '../utils/mailer.js'; // Asegúrate de tener esta función en mailer.js

export const renderProductList = async (req, res) => {
  const products = await getAllProductsService();
  console.log("Products in renderProductList:",req.user);
  res.render('currentProducts', { products });
};

export const renderProductPanel = async (req, res) => {
  const products = await getAllProductsService();
  res.render('adminProducts', { products });
};

export const handleProductCreate = async (req, res) => {
  await createProductService(req.body);
  res.redirect('/admin/products');
};

export const handleProductDelete = async (req, res) => {
  await deleteProductService(req.params.id);
  res.redirect('/admin/products');
};

export const renderEditProduct = async (req, res) => {
  const product = await getProductByIdService(req.params.id);
  res.render('editProduct', { product });
};

export const handleProductUpdate = async (req, res) => {
  await updateProductService(req.params.id, req.body);
  res.redirect('/admin/products');
};

export const addToCart = async (req, res) => {
  const productId = req.params.id;
 
  if (!productId) {
    return res.status(400).json({ message: 'Falta el ID del producto' });
  }

  const user = req.user;
  console.log("User in addToCart:", user);
  
  if (!user || user.role !== 'user') {
    return res.status(403).send('Solo usuarios pueden comprar');
  }

  const product = await getProductByIdService(productId);

  const cart = await cartModel.findById(user.orders);
  
  if (!cart) {
    return res.status(404).json({ message: 'Carrito no encontrado' });
  }
  console.log("cart",cart);

  const existingProduct = cart.products.find(p => p.product.toString() === productId);
  if (existingProduct) { 
    existingProduct.quantity += 1;
    existingProduct.price = product.precio; 
  }else{
  cart.products.push({
    product: new mongoose.Types.ObjectId(productId),
    price: product.precio,
    quantity: 1
  });
  }

  await cart.save();
  
  res.redirect('/current');
};

export const checkout = async (req, res) => {
  const user = req.user;

  const cart = await cartModel.findById(user.orders).populate('products.product');

  if (!cart) {
    return res.status(404).send('Carrito no encontrado');
  }

  if (!cart.products || cart.products.length === 0) {
    return res.status(400).send('El carrito está vacío. No se puede completar la compra.');
  }

  const total = cart.products.reduce((acc, item) => acc + item.product.precio * item.quantity, 0);
  const ticketId = Math.random().toString(36).substring(2, 10).toUpperCase();
  const date = new Date().toLocaleString();

  await sendTicketEmail(user.email, {
    ticketId,
    total,
    date,
    items: cart.products
  });

  cart.products = []; // Elimina todos los productos del carrito
  await cart.save();

  res.render('ticketSuccess', { ticketId, total, date });
};
