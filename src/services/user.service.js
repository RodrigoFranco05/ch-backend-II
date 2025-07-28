import UserRepository from '../repositories/user.repository.js';

export const getAllUsersService = async () => {
  return await UserRepository.getAll();
};

export const getUserByIdService = async (id) => {
  return await UserRepository.getById(id);
};

export const createUserService = async (data) => {
  return await UserRepository.create(data);
};

export const updateUserService = async (id, data) => {
  return await UserRepository.update(id, data);
};

export const deleteUserService = async (id) => {
  return await UserRepository.delete(id);
};