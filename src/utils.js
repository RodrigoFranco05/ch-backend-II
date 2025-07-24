import bcrypt from "bcrypt"; //para hashear las contraseñas

export const createHash = (password) => {    //generanmos el hash
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));   //gensaltsynbs es con al frase con al que se hashea un nu ero de 10 veces
};

export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password)
};