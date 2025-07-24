import express from 'express';
import usermodel from '../models/user.model.js'; // Adjust the path as necessary

const router = express.Router();

router.get('/users', async(req, res) => {
    try {
        const users = await usermodel.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users' });
    }
});

router.get('/users/id', async(req, res) => {
    const {id} =req.params;
    try {
        const user = await usermodel.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users' });
    }
});

router.post('/users', async(req, res) => {
    try {
        
        const {first_name, last_name, email, age, password, cart, role} = req.body;
        const user = await usermodel.create({first_name, last_name, email, age , password, cart, role});
        res.status(201).json(user);
    }
    catch (error) {
        console.error("❌ Error creando usuario:", error); // <--- esto es nuevo
        res.status(500).json({ message: 'Error creating user' });
    }
});

router.put('/users/:id', async(req, res) => {
    const { id } = req.params
    try {
        const result = await usermodel.updateOne({ "_id": id }, { $set:{ ...req.body }});
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
});

router.delete('/users/:id', async(req, res) => {
    const { id } = req.params
    try {
        const result = await usermodel.deleteOne({ "_id": id });
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
});

export default router;