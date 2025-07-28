import UserRepository from '../repositories/user.repository.js';
import CartRepository from '../repositories/cart.repository.js';
import { createHash, isValidPassword, generateToken } from '../utils/utils.js';
import UserDTO from '../dtos/user.dto.js';
import jwt from 'jsonwebtoken';
import { config } from '../../config/config.js';
import { sendResetPasswordEmail } from '../utils/mailer.js';


export const registerUserService = async ({ first_name, last_name, email, password, age }) => {
  const emailNormalized = email.trim().toLowerCase();
  const existingUser = await UserRepository.getByEmail(emailNormalized);
  if (existingUser) throw new Error('Usuario ya registrado');

  const cart = await CartRepository.createCart();

  const newUser = {
    first_name,
    last_name,
    email: emailNormalized,
    age,
    password: createHash(password),
    cart: cart._id,
    role: 'user'
  };

  return await UserRepository.create(newUser);
};

export const loginUserService = async (email) => {
  const user = await UserRepository.getByEmail(email);
  if (!user) throw new Error('Usuario no encontrado');
  
  const userDTO = new UserDTO(user);
  
  const token = generateToken({ ...userDTO });
  return { user: userDTO, token };
};

export const getUserByEmail = async (email) => {
  return await UserRepository.getByEmail(email);
};

export const githubCallbackService = async (user) => {
  if (!user) throw new Error("No user provided from GitHub strategy");

  const userDTO = new UserDTO(user);
 console.log("UserDTO from GitHub:", userDTO);
  const token = generateToken({ ...userDTO });
  return token;
};

export const logoutUserService = async (req) => {
  return new Promise((resolve, reject) => {
    req.session?.destroy((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

export const forgotPasswordService = async (email) => {
  const user = await UserRepository.getByEmail(email);
  if (!user) throw new Error('No se encontró el usuario');

  const token = jwt.sign({ email }, config.SECRET_RESET, { expiresIn: '1h' });
  const resetLink = `http://localhost:3000/user/reset-password/${token}`;
  await sendResetPasswordEmail(email, resetLink);
};

export const verifyResetTokenService = async (token) => {
  try {
    const decoded = jwt.verify(token, config.SECRET_RESET);
    return !!decoded;
  } catch {
    return false;
  }
};

export const resetPasswordService = async (token, newPassword) => {
  const decoded = jwt.verify(token,config.SECRET_RESET);
  const user = await UserRepository.getByEmail(decoded.email);
  if (!user) throw new Error('Usuario no encontrado');

  const samePassword = isValidPassword(user, newPassword);
  if (samePassword) throw new Error('La nueva contraseña no puede ser igual a la anterior');

  const newHash = createHash(newPassword);
  await UserRepository.update(user._id, { password: newHash });
};