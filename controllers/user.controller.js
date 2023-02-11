const { Request, Response } = require("express");
const UserModel = require("../models/user.model");
const {
  generateHashedPassword,
  comparePassword,
  generateToken,
} = require("../utils/auth");

/**
 * Register user
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate data
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check duplicate users
  const duplicateUser = await UserModel.findOne({ email }).lean().exec();
  if (duplicateUser) {
    return res.status(400).json({ error: "Duplicate user with this email" });
  }

  // Generate hashed password
  const hashedPassword = await generateHashedPassword(password);

  // Now save the user to database
  const newUser = await UserModel.create({
    name,
    email,
    password: hashedPassword,
  });

  if (newUser) {
    // Generate access token
    const accessToken = generateToken(
      newUser._id.toString(),
      newUser.name,
      newUser.email
    );

    res.status(201).json({ message: "User created successfuly", accessToken });
  } else {
    res.status(400).json({ error: "Invalid user data received" });
  }
};

/**
 * Login user
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate data
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if a user exists with this email
  const foundUser = await UserModel.findOne({ email }).exec();
  if (!foundUser) {
    return res.status(401).json({ error: "No user exists with this email" });
  }

  const match = await comparePassword(password, foundUser.password);
  if (!match) return res.status(401).json({ error: "Passwords not match" });

  // Generate access token
  const accessToken = generateToken(
    foundUser._id.toString(),
    foundUser.name,
    foundUser.email
  );

  res.status(200).json({ message: "Login user successfully", accessToken });
};
