import { Router } from 'express';
import {
  renderProductList,
  renderProductPanel,
  handleProductCreate,
  handleProductDelete,
  renderEditProduct,
  handleProductUpdate,
  addToCart,
  checkout
} from '../controllers/product.controler.js';
import { authToken, authorizeRoles } from '../utils/utils.js';

const router = Router();

router.get('/current', authToken, renderProductList);
router.post('/add-to-cart/:id', authToken, authorizeRoles('user'), addToCart);
router.post('/checkout', authToken, authorizeRoles('user'), checkout);

// Panel de admin
router.get('/admin/products', authToken, authorizeRoles('admin'), renderProductPanel);
router.post('/admin/products', authToken, authorizeRoles('admin'), handleProductCreate);
router.post('/admin/products/delete/:id', authToken, authorizeRoles('admin'), handleProductDelete);
router.get('/admin/products/edit/:id', authToken, authorizeRoles('admin'), renderEditProduct);
router.post('/admin/products/edit/:id', authToken, authorizeRoles('admin'), handleProductUpdate);

export default router;
