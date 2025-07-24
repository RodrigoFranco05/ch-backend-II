import express from 'express';
import userRoutes from './routes/user.routes.js'; //rutas
import loginRoutes from './routes/login.routes.js'; //rutas de login
import session ,{MemoryStore} from 'express-session';  //para las cookies
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser'; // para encriptar minimamente las cookies
import MongoStore from 'connect-mongo'; // para guardar las sesiones en la base de datos
import dotenv from 'dotenv';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import initializePassport from '../config/passport.config.js';


dotenv.config()
const app = express();
//const PORT = PORT || 3000;
//const MONGO_URI = MONGO_URI; // Update with your MongoDB URI
const { PORT, MONGO_URI, SECRET_SESSION } = process.env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // para formularios HTML tradicionales

//midwares
app.use(express.json());
//app.use(cookieParser("codigo3ncript4d0"));
app.use(session({
  secret: SECRET_SESSION,
  resave:true,
  saveUninitialized: true,
  cookie:{
    httpOnly: true,
    maxAge: 60000,
  },
  store: MongoStore.create({ mongoUrl: MONGO_URI }),
}))
app.use(passport.initialize)
app.use(passport.session())

// Connect to MongoDB
mongoose.connect(MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
})


app.get('/', (req, res) => {
  res.cookie("miCookie", "valorCookie", { maxAge: 9000000, httpOnly: true });
  res.send('Hello World!');
});

app.get('/home', (req, res) => {
  res.render('home', {
    nombre: 'Rodrigo',
    title: 'Inicio'
  });
});

// app.get('/register', (req, res) => {
//   res.render('home', {
//     nombre: 'Rodrigo',
//     title: 'Inicio'
//   });
// });


//rutas
app.use('/api', userRoutes); 
app.use('/user',loginRoutes)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});