const jwt = require("jsonwebtoken");
const User = require("../models/User");

// requireAuth is middleware and we can place it inside any route where we need to check for authentication.
// if everything is properly verified, we fire the next() and user can carry out whatever they were doing
// else we will redirect the user to Login page
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "secret string signature", (err, decodedToken) => {
      if (err) {
        res.redirect("/login");
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    res.redirect("/login");
  }
};

const checkUser = (req, res, next) => {
  // "checkuser will run for all routes!!!!!"
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "secret string signature", async (err, decodedToken) => {
      if (err) {
        console.log("error finding user");
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
