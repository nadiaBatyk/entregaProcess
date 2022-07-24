const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Usuarios = require("../schemas/userSchema");
const bCrypt = require("bcrypt");

async function isValidPassword(user, password) {
  return await bCrypt.compare(password, user.password);
}
async function createHash(password) {
  return await bCrypt.hash(password, 10);
}

passport.use(
  "registro",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const userBD = await Usuarios.findOne({ email });
      if (userBD) {
        console.log("ya existe el usuario");
        return done(null, false);
      }
      const newUser = new Usuarios();
      newUser.email = email;
      await createHash(password).then((res) => (newUser.password = res));
      await newUser.save();
      done(null, newUser);
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const userBD = await Usuarios.findOne({ email });
      if (!userBD) {
        console.log("no existe el user");
        return done(null, false);
      }
      let passValida;
      await isValidPassword(userBD, password).then((res) => (passValida = res));
      if (!passValida) {
        console.log(`pass incorrecta`);
        return done(null, false);
      }
      return done(null, userBD);
    }
  )
);

passport.serializeUser((usuario, done) => {
  done(null, usuario._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await Usuarios.findById(id);
  done(null, user);
});
