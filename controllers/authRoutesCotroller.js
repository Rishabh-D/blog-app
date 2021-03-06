const User = require("../models/User");
const jwt = require("jsonwebtoken");

const signup_get = (req, res) => {
  res.render("signup", { title: "Sign Up" });
};

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let error = {
    email: "",
    password: "",
  };
  // console.log(err.errors.email);
  // console.log(err.errors.password);
  // err.errors
  if (err.code == 11000) {
    console.log("code");
    error["email"] = "Email is already registered";
    return error;
  }

  if (err.message.includes("users validation failed")) {
    // console.log(err);
    console.log(typeof err.errors);
    Object.values(err.errors).forEach((erro) => {
      console.log(erro.path, erro.message);
      error[erro.path] = erro.message;
    });

    return error;
  }
};

//creating tokens
let createToken = (id) => {
  return jwt.sign({ id }, "secret string signature", {
    expiresIn: 1 * 24 * 60 * 60,
  });
};
//

const signup_post = (req, res) => {
  // console.log(req.body);
  // res.status(400).send("lol");
  const user = new User(req.body);
  user
    .save()
    .then((result) => {
      const token = createToken(user._id);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
      });
      res.status(201).json({ user: user._id });
    })
    .catch((err) => {
      console.log("errrr!");
      const error = handleErrors(err);
      res.status(400).json({ error });
    });
  //create new user with these properties
};

const login_get = (req, res) => {
  res.render("login", { title: "Login" });
};

const login_post = (req, res) => {
  res.send("user login");
};

module.exports = {
  signup_get,
  login_get,
  signup_post,
  login_post,
};
