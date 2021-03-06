const jwt = require("jsonwebtoken");

//requireAuth is middleware and we can place it insode any route where we need to check for authentication.
//if everything is properly verifies, we fire the next() and user can carry out whatever they were doing
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

module.exports = { requireAuth };
