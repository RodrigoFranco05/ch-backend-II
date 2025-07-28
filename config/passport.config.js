import passport from 'passport';
import local from 'passport-local';
import userModel from '../src/models/user.model.js';
import cartModel from '../src/models/cart.model.js';
import { createHash, isValidPassword } from '../src/utils/utils.js';
import GitHubStrategy from 'passport-github2';
import crypto from 'crypto';
import { config } from '../config/config.js';

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        const { first_name, last_name, age } = req.body;
        const role = 'user'
        try {
          let userFound = await userModel.findOne({ email });

          if(userFound) {
            console.error("User already exists");
            return done(null, false)
          }
          const newCart = await cartModel.create({products:[]})
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            cart: newCart._id,
            password: createHash(password),
            role: role
          };

          const user = await userModel.create(newUser);
          return done(null, user)
        } catch(err) {
          done(err) 
        }
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
 
  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    delete user.password;
    done(null, user)
  })

  passport.use(
  'login',
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await userModel.findOne({ email });
        if (!user) {
          console.log("User not found");
          return done(null, false);
        }

        if (!isValidPassword(user, password)) {
          console.log("Incorrect password");
          return done(null, false);
        }
        
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: config.GIT_CLIENT_ID,
      clientSecret: config.GIT_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/user/githubcallback'
    },
    async (accessToken, refreshToken, profile, done) => {
    
      try {
        let user = await userModel.findOne({ email: profile._json.email });

        if (!user) {
          const newCart = await cartModel.create({ products: [] });
          user = await userModel.create({
            first_name: profile._json.name || profile.username,
            last_name: 'GitHub',
            email: profile._json.email,
            password: createHash(crypto.randomBytes(8).toString('hex')),
            age: 0,
            cart: newCart._id,
            role: 'user'
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

};


export default initializePassport