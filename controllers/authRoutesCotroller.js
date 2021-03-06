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

  //handelling incorrect email : LOGIN
  // console.log("dekhte hai");
  if (err.message === "Incorrect email") {
    // console.log("hs");
    error.email = "Email is not registered";
    console.log("error.email = ", error.email);
  }
  //handelling incorrect password : LOGIN
  if (err.message === "Incorrect password") {
    error.password = "Password is incorrect";
    console.log("error.password = ", error.password);
  }

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
  return error;
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

const login_post = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);

  try {
    console.log("TRY BEGIN 1");
    const user = await User.login(email, password);
    console.log("TRY BEGIN 2");
    // res.status(200).json({ user: user._id });

    const token = createToken(user._id);
    console.log("TRY BEGIN 3");
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    console.log("TRY BEGIN 4");
    res.status(200).json({ user: user._id });
    console.log("TRY BEGIN 5");
  } catch (err) {
    console.log("handelling errors");
    const error = handleErrors(err);
    console.log(error);
    res.status(400).json({ error });
  }
};

const logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

module.exports = {
  signup_get,
  login_get,
  signup_post,
  login_post,
  logout_get,
};
