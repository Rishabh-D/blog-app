const mongoose = require("mongoose");
const { isEmail } = require("Validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true, //converts entered email to lowercase
    // validate:[(valEnteredByUser)=>{}]
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [8, "Minimum password length is 8 character"],
  },
});

//this is called before data is saved in database
userSchema.pre("save", async function (next) {
  // console.log("user about to be created and saved", this);
  console.log("pre");
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/// this is called after data is saved to the database
userSchema.post("save", function (doc, next) {
  console.log("new user is created and saved", doc);
  next();
});

//static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email: email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    } else {
      throw Error("Incorrect password");
    }
  }
  throw Error("Incorrect email");
};

const User = mongoose.model("users", userSchema); //mongoose will pluralize user to users, make sure db name is users on Atlas

module.exports = User;
