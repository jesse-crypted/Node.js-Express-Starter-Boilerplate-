// Require the mongoose library
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const { Schema } = mongoose; // destructuring mongoose

// Define a new mongoose schema for a User
const userSchema = new Schema({
  name: { type: String, required: [true, 'A user must have a name'] },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'], // a required input
    // A custom password validator function
    validate: {
      // this only works on Save
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match',
    },
  },
  resume: String, // String is shorthand for {type: String}
  tokens: [{ type: Object }],
});

// Implement encryption
//  A pre save middle ware
userSchema.pre('save', async function (next) {
  // Only run this function if password was modified
  if (!this.isModified('password')) return next();

  // Hash or encrypt password using bcrypt with the cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete password Confirm field
  this.passwordConfirm = undefined;
  next();
});

// An instance method: a method available on all documents of a certain collection
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // candidatePassword is the hashed password
  // userPassword is the password from the requesy body at login
  return await bcrypt.compare(candidatePassword, userPassword);
};

// create a new Mongoose model based on the User schema
const User = mongoose.model('User', userSchema);

module.exports = User;
