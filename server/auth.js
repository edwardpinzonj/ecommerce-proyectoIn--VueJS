const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/User");

// Configuración de la estrategia de autenticación local
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        console.log(email, password);
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
          return done(null, false, { message: "Usuario no encontrado" });
        }

        const isMatch = await user.comparePassword(password);
        console.log(isMatch);
        if (!isMatch) {
          return done(null, false, { message: "Contraseña incorrecta" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Configuración de la estrategia de autenticación de Google
passport.use(
  new GoogleStrategy(
    {
      clientID: "GOOGLE_CLIENT_ID",
      clientSecret: "GOOGLE_CLIENT_SECRET",
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          // Otros campos del usuario que desees guardar
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serializa el usuario en la sesión
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserializa el usuario de la sesión
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
