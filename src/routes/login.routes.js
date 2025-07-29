import express from 'express';
import passport from 'passport';
import {
  renderLoginView,
  handleLogin,
  renderRegisterView,
  handleRegister,
  handleLogout,
  renderProfileView,
  githubCallbackController,
  forgotPasswordController,
  renderResetPasswordFormController,
  resetPasswordController,
  renderForgotPasswordView,
  showCartController,
  emptyCartController
} from '../controllers/login.controller.js';
import { authToken, authorizeRoles } from '../utils/utils.js';


const router = express.Router();

router.get('/login', renderLoginView);
router.post('/login', passport.authenticate('login', { failureRedirect: '/user/login' }), handleLogin);

router.get('/register', renderRegisterView);
router.post('/register', passport.authenticate('register', { failureRedirect: '/user/registroerror' }), handleRegister);

router.get('/logout', handleLogout);
router.get('/profile', authToken, renderProfileView);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }),githubCallbackController);

router.get('/registroerror', (req, res) => {
  res.status(401).send("Hubo un error en el registro");
});

router.post('/forgot-password', forgotPasswordController);
router.get('/reset-password/:token', renderResetPasswordFormController);
router.post('/reset-password/:token', resetPasswordController);

router.get('/forgot-password', renderForgotPasswordView);

router.get('/cart', authToken, authorizeRoles('user'),showCartController);
router.post('/cart/empty', authToken, authorizeRoles('user'),emptyCartController);


export default router;