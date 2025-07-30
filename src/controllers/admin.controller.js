import userModel from '../models/user.model.js';
import { getAllUsersService } from '../services/user.service.js';
import { createHash } from '../utils/utils.js';
import UserDTO from '../dtos/user.dto.js';

export const renderAdminPanel = async (req, res) => {
  const rawUsers = await getAllUsersService();
  const users = rawUsers.map(user => new UserDTO(user));
  res.render('adminPanel', { users });
};

export const handleUserCreate = async (req, res) => {
  try {
    const { first_name, last_name, email, password, age, role } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) return res.status(400).send('Email ya registrado');

    const newUser = await userModel.create({
      first_name,
      last_name,
      email,
      password: createHash(password),
      age,
      role,
      cart: null
    });

    res.redirect('/admin/panel');
  } catch (error) {
    res.status(500).send('Error creando usuario');
  }
};

export const handleUserDelete = async (req, res) => {
  await userModel.findByIdAndDelete(req.params.id);
  res.redirect('/admin/panel');
};

export const renderEditUserForm = async (req, res) => {
  const user = await userModel.findById(req.params.id);
  res.render('editUser', { user });
};

export const handleUserUpdate = async (req, res) => {
  const { first_name, last_name, email, age, role } = req.body;
  await userModel.findByIdAndUpdate(req.params.id, {
    first_name, last_name, email, age, role
  });
  res.redirect('/admin/panel');
};