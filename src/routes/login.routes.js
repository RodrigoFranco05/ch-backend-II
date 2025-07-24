import express from 'express';
import userModel from '../models/user.model.js'; // Adjust the path as necessary
import cartModel from '../models/cart.model.js';
import { createHash, isValidPassword } from '../utils.js';



const router = express.Router();


router.get('/login', async(req, res) => {
        res.render('login');
});

router.post('/login', async(req,res) => {
    const {email, password} = req.body;
    if(!email || !password) return res.status(400).send("faltan datos");
    
    const user = await userModel.findOne({email});
    if(!user) return res.status(500).send("Usuario no encontrado")

    if(isValidPassword(user, password)){
        delete user.password;
        req.session.user =user;
        const carrito = cartModel.findById(user.carrito)
        res.redirect('profile')
    }else{
        res.render('login')
    }


});

router.get('/profile', async(req,res) =>{
    const user = req.session.user
    console.log("session",req.session.user)

    if(!user) return res.render('login')
    const carrito = cartModel.findById(user.carrito)
    res.render('profile', {
          nombre: user.first_name,
          apellido: user.last_name,
          email: user.email,
          edad: user.age,
          carrito: carrito,
          rol: user.role,

        })
})


router.get('/register', (req, res) => {
  res.render('register'); // Muestra la vista del formulario
});

router.post('/register', async(req, res) => {    
    const role = 'user'

    try {
        const {first_name, last_name, email, age, password} = req.body;
        if (!first_name || !last_name || !email || !age||!password) {
            return res.status(400).json({ message: 'Need more info.' });
        }
        // Check if user already exists
        const newCart = await cartModel.create({products:[]})
        const newUser = await userModel.create({first_name, last_name, email, age , password: createHash(password), cart: newCart._id, role});
        req.session.user = { email };

        res.status(201).json({ message: 'User registered successfully', user: req.session.user });
    }
    catch (error) {
        console.error("❌ Error creando usuario:", error); // <--- esto es nuevo
        res.status(500).json({ message: 'Error creating user', error });
    }
});

router.get('/logout', async(req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Error logging out' });
        }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.render('logout')
    });
})


export default router;