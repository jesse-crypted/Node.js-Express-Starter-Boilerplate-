const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./../models/userModel');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Signup or create a new user
exports.registerUser = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    // JWT: Signing a token with
    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'Success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// Logging Users in
exports.login = async (req, res, next) => {
  // Destructure the request body to easily access properties
  const { email, password } = req.body;

  // check if email and password exist
  if (!email || !password) {
    return next(
      res.status(400).json({
        status: 'fail',
        message: 'Missing Input',
      })
    );
  }

  // check if passsword is correct
  // Uniquely select the password field because of the schema false selection
  const user = await User.findOne({ email: email }).select('+password');
  // const correct = await user.correctPassword(password, user.password);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      res.status(401).json({
        status: 'fail',
        message: 'Incorrect Email or Password',
      })
    );
  }

  // if everything is ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'Success',
    token,
  });
};
