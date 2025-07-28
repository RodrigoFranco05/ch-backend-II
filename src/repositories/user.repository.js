import {
  createUser,
  findUserByEmail,
  findAllUsers,
  findUserById,
  updateUser,
  deleteUser
} from './daos/user.dao.js';

class UserRepository {
  async create(data) {
    return await createUser(data);
  }

  async getByEmail(email) {
    return await findUserByEmail(email);
  }

  async getAll() {
    return await findAllUsers();
  }

  async getById(id) {
    return await findUserById(id);
  }

  async update(id, updateData) {
    return await updateUser(id, updateData);
  }

  async delete(id) {
    return await deleteUser(id);
  }
}

export default new UserRepository();
