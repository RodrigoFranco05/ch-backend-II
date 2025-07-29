import bcrypt from "bcrypt"; //para hashear las contraseñas
import jwt from 'jsonwebtoken';
import { config } from '../../config/config.js'; 


const SECRET_JWT = config.SECRET_JWT || 'claveJWT123';


export const createHash = (password) => {    //generanmos el hash
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));   //gensaltsynbs es con al frase con al que se hashea un nu ero de 10 veces
};

export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password)
};

export const generateToken = (user) => {
  return jwt.sign(user, SECRET_JWT, { expiresIn: '1h' });
};

export const authToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.redirect('/user/login');

  jwt.verify(token, SECRET_JWT, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = decoded;
    res.locals.user = decoded; //disponible para Handlebars
    console.log("User in authToken:", req.user);
    next();
  });
};

export const authTokenCurrent = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return next();

  jwt.verify(token, SECRET_JWT, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    req.user = decoded;
    res.locals.user = decoded; //disponible para Handlebars
    console.log("User in authToken:", req.user);
    next();
  });
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user) {
      return res.render('message',{ message: 'Usuario no autenticado' });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.render('message', {
        message: 'No tienes permiso para acceder a esta ruta'});
    }

    next();
  };
};