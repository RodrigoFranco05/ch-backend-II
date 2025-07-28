import {
getAllUsersService,
getUserByIdService,
createUserService,
updateUserService,
deleteUserService
} from '../services/user.service.js';

export const getAllUsersController = async (req, res) => {
try {
const users = await getAllUsersService();
res.status(200).json(users);
} catch (error) {
res.status(500).json({ message: 'Error retrieving users', error });
}
};

export const getUserByIdController = async (req, res) => {
try {
const user = await getUserByIdService(req.params.id);
res.status(200).json(user);
} catch (error) {
res.status(500).json({ message: 'Error retrieving user', error });
}
};

export const createUserController = async (req, res) => {
try {
const user = await createUserService(req.body);
res.status(201).json(user);
} catch (error) {
res.status(500).json({ message: 'Error creating user', error });
}
};

export const updateUserController = async (req, res) => {
try {
const result = await updateUserService(req.params.id, req.body);
res.status(200).json(result);
} catch (error) {
res.status(500).json({ message: 'Error updating user', error });
}
};

export const deleteUserController = async (req, res) => {
try {
const result = await deleteUserService(req.params.id);
res.status(200).json(result);
} catch (error) {
res.status(500).json({ message: 'Error deleting user', error });
}
};

