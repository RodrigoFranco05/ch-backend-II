import { loginUserService, githubCallbackService, logoutUserService ,forgotPasswordService, verifyResetTokenService, resetPasswordService, getUserCartService, emptyCartService} from '../services/login.service.js';
import cartModel from '../models/cart.model.js';
import UserDTO from '../dtos/user.dto.js';

export const renderLoginView = (req, res) => {
  res.render('login');
};

export const handleLogin = async (req, res) => {
  try {
    const user = await loginUserService(req.user.email);
    res.cookie('token', user.token, { httpOnly: true, maxAge: 60 * 60 * 1000 });
    res.redirect('/current');
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Login failed");
  }
};

export const renderRegisterView = (req, res) => {
  res.render('register');
};

export const handleRegister = async (req, res) => {
  try {
    res.render('registroExitoso');
  } catch (error) {
    console.error("Error creando usuario desde controller:", error);
    res.status(500).json({ message: 'Error en el registro', error });
  }
};

export const handleLogout = async (req, res) => {
  try {
    await logoutUserService(req);
    res.clearCookie('connect.sid');
    res.clearCookie('token');
    res.render('logout');
  } catch (error) {
    res.status(500).json({ message: 'Error logging out', error });
  }
};

export const renderProfileView = async (req, res) => {
  if (!req.user) return res.render('login');

  const userDTO = new UserDTO(req.user);

  const carrito = await cartModel.findById(userDTO.orders); // orders = cart.orders

  res.render('profile', {
    nombre: userDTO.first_name,
    apellido: userDTO.last_name,
    email: userDTO.email,
    edad: userDTO.age,
    rol: userDTO.role,
    carrito: userDTO.orders,
  });
};

export const githubCallbackController = async (req, res) => {
  try {
    const token = await githubCallbackService(req.user);
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: true
    });
    res.redirect('profile');
  } catch (error) {
    console.error("GitHub login error:", error);
    res.status(500).send("GitHub login failed");
  }
};

  export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  try {
    await forgotPasswordService(email);
    res.render( 'message', { message: 'Email enviado para restablecer contraseña' });
  } catch (err) {
    res.status(500).json({ message: 'Error enviando el email', error: err.message });
  }
};

export const renderForgotPasswordView = (req, res) => {
  res.render('forgotPassword');
};

export const renderResetPasswordFormController = async (req, res) => {
  const { token } = req.params;
  try {
    const isValid = await verifyResetTokenService(token);
    if (!isValid) return res.status(400).send('Token inválido o expirado');
    console.log("Token válido:", token);
    res.render('resetPassword', { token });
  } catch (err) {
    res.status(400).send('Token inválido o expirado');
  }
};

export const resetPasswordController = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    await resetPasswordService(token, newPassword);
    res.send('Contraseña actualizada correctamente');
  } catch (err) {
    res.status(400).json({ message: 'Error al restablecer contraseña', error: err.message });
  }
};

export const showCartController = async (req, res) => {
  try {
    if (!req.user) return res.render('login');
    const user = req.user;
    const cart = await getUserCartService(user.orders);
    const productosPlano = cart.products.map(item => ({
    nombre: item.product.nombre,
    precio: item.product.precio,
    sku: item.product.sku,
    quantity: item.quantity,
    _id: item.product._id.toString()
    }));

    res.render('cart', { products: productosPlano });
  } catch (error) {
    console.error("Error al mostrar el carrito:", error);
    res.status(500).send("Error al mostrar el carrito");
  }
};

export const emptyCartController = async (req, res) => {
  try {
    const user = req.user;
    await emptyCartService(user.orders);
    res.redirect('/user/cart');
  } catch (error) {
    console.error("Error al vaciar carrito:", error);
    res.status(500).send("Error al vaciar carrito");
  }
};