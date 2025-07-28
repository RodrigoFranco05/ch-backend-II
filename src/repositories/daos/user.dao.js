import userModel from '../../models/user.model.js';

export const createUser = async (userData) => {
  return await userModel.create(userData);
};

export const findUserByEmail = async (email) => {
  return await userModel.findOne({ email });
};


export const findAllUsers = async () => {
return await userModel.find();
};

export const findUserById = async (id) => {
return await userModel.findById(id);
};

export const updateUser = async (id, updateData) => {
return await userModel.updateOne({ _id: id }, { $set: updateData });
};

export const deleteUser = async (id) => {
return await userModel.deleteOne({ _id: id });
};

const userDao = {
  getByEmail: async (email) => {
    return await userModel.findOne({ email });
  },

  create: async (userData) => {
    return await userModel.create(userData);
  },

  getById: async (id) => {
    return await userModel.findById(id);
  }
};

export default userDao;

