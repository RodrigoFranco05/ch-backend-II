import express from 'express';
import userRoutes from './routes/user.routes.js'; //rutas
import loginRoutes from './routes/login.routes.js'; //rutas de login
import adminRoutes from './routes/admin.routes.js'; // admin routes para crud
import productRouter from './routes/products.router.js'; // product routes para crud
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
import methodOverride from 'method-override'; //permitir DELETE en formularios HTML
import { config } from '../config/config.js';


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine('handlebars', engine({
  helpers: {
    ifEqual: function (a, b, options) {
      return a === b ? options.fn(this) : options.inverse(this);
    }
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true })); // para formularios HTML tradicionales

//midwares
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({
  secret: config.SECRET_SESSION,
  resave:true,
  saveUninitialized: true,
  cookie:{
    httpOnly: true,
    maxAge: 60000,
    secure: true,
    sameSite:true,
  },
  store: MongoStore.create({ mongoUrl: config.MONGO_URI }),
}))
initializePassport();  //
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, config.SECRET_JWT);
      console.log("decoded", decoded)
      res.locals.user = decoded;
    } catch (err) {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

// Connect to MongoDB
mongoose.connect(config.MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
})

app.use('/', productRouter);

app.get('/home', (req, res) => {
  res.render('home', {
    nombre: 'Rodrigo',
    title: 'Inicio'
  });
});


//rutas
app.use('/api', userRoutes); 
app.use('/user',loginRoutes);
app.use('/admin', adminRoutes);


app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});