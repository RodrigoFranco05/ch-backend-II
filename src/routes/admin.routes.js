import express from 'express';
import { authToken } from '../utils/utils.js';
import {
  renderAdminPanel,
  handleUserCreate,
  handleUserDelete,
  renderEditUserForm,
  handleUserUpdate
} from '../controllers/admin.controller.js';

const router = express.Router();



router.get('/panel', authToken, renderAdminPanel);
router.post('/users', authToken, handleUserCreate);
router.post('/users/:id', authToken, handleUserUpdate);
router.get('/users/edit/:id', authToken, renderEditUserForm);
router.delete('/users/:id', authToken, handleUserDelete); 

export default router;