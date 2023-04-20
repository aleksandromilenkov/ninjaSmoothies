const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [6, "Minimum password length is 6 characters"],
  },
});

// Mongoose hooks (post and pre) :
// you can replace save with remove if you want that event
// fires a function after doc saved to db
userSchema.post("save", (doc, next) => {
  console.log("new user was created and saved", doc);
  next(); // must invoke the next method in the end to go to the next middleware
});

// fire a function before doc saved to db
userSchema.pre("save", async function (next) {
  // this keyword refers to the instance we are trying to create and save
  console.log("user about to be created and saved", this);
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email: email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

const User = mongoose.model("user", userSchema);
module.exports = User;
