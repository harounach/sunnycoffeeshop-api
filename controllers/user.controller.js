const { Request, Response } = require("express");
const UserModel = require("../models/user.model");
const {
  generateHashedPassword,
  comparePassword,
  generateToken,
} = require("../utils/auth");

/**
 * Get users
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.getUsers = async (req, res) => {
  const { perpage = 8, page = 1, order = -1 } = req.query;
  const users = await UserModel.find()
    .sort({ createAt: order })
    .limit(perpage * 1)
    .skip((page - 1) * perpage)
    .select("-password")
    .lean()
    .exec();
  const count = await UserModel.countDocuments();
  const pages = Math.ceil(count / perpage);
  res.json({
    message: "Get users",
    pages,
    page,
    data: users,
    count,
  });
};

/**
 * Register user
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.registerUser = async (req, res) => {
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
      newUser.email,
      newUser.admin
    );

    const user = {
      _id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      admin: newUser.admin,
      createdAt: newUser.createdAt,
      accessToken,
    };

    res.status(201).json({ message: "User created successfuly", data: user });
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
exports.loginUser = async (req, res) => {
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
    foundUser.email,
    foundUser.admin
  );

  const user = {
    _id: foundUser._id.toString(),
    name: foundUser.name,
    email: foundUser.email,
    admin: foundUser.admin,
    createdAt: foundUser.createdAt,
    accessToken,
  };

  res.status(200).json({ message: "Login user successfully", data: user });
};

/**
 * Update user name
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.updateUserName = async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  // Validate data
  if (!id || !name) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if user exists
    const userToUpdate = await UserModel.findById(id).exec();
    if (!userToUpdate) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Now save the user to database
    userToUpdate.name = name;
    const updatedUser = await userToUpdate.save();

    if (updatedUser) {
      // Generate access token
      const accessToken = generateToken(
        updatedUser._id.toString(),
        updatedUser.name,
        updatedUser.email,
        updatedUser.admin
      );

      const user = {
        _id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        admin: updatedUser.admin,
        createAt: updatedUser.createdAt,
        accessToken,
      };

      return res.status(201).json({ message: "User name updated successfuly", data: user });
    } else {
      return res.status(400).json({ error: "Invalid user data received" });
    }
  } catch (err) {
    res.status(400).json({ error: "Unable to update user name" });
  }
};

/**
 * Update user email
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.updateUserEmail = async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;

  // Validate data
  if (!id || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if user exists
    const userToUpdate = await UserModel.findById(id).exec();
    if (!userToUpdate) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Now save the user to database
    userToUpdate.email = email;
    const updatedUser = await userToUpdate.save();

    if (updatedUser) {
      // Generate access token
      const accessToken = generateToken(
        updatedUser._id.toString(),
        updatedUser.name,
        updatedUser.email,
        updatedUser.admin
      );

      const user = {
        _id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        admin: updatedUser.admin,
        createAt: updatedUser.createdAt,
        accessToken,
      };

      return res.status(201).json({ message: "User email updated successfuly", data: user });
    } else {
      return res.status(400).json({ error: "Invalid user data received" });
    }
  } catch (err) {
    res.status(400).json({ error: "Unable to update user email" });
  }
};

/**
 * Update user password
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { id } = req.params;

  // Validate data
  if (!id || !oldPassword || !newPassword) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if user exists
    const userToUpdate = await UserModel.findById(id).exec();
    if (!userToUpdate) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Check if old password is correct
    const match = await comparePassword(oldPassword, userToUpdate.password);
    if (!match) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    // Generate hashed password
    const hashedNewPassword = await generateHashedPassword(newPassword);

    // Now save the user to database
    userToUpdate.password = hashedNewPassword;
    const updatedUser = await userToUpdate.save();

    if (updatedUser) {
      // Generate access token
      const accessToken = generateToken(
        updatedUser._id.toString(),
        updatedUser.name,
        updatedUser.email,
        updatedUser.admin
      );

      const user = {
        _id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        admin: updatedUser.admin,
        createAt: updatedUser.createdAt,
        accessToken,
      };

      return res.status(201).json({ message: "User password updated successfuly", data: user });
    } else {
      return res.status(400).json({ error: "Invalid user data received" });
    }
  } catch (err) {
    res.status(400).json({ error: "Unable to update user password" });
  }
};

/**
 * Seed admin user
 *
 * @param {Request} req
 * @param {Response} res
 */
exports.seedAdminUser = async (req, res) => {
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
    admin: true,
  });

  if (newUser) {
    // Generate access token
    const accessToken = generateToken(
      newUser._id.toString(),
      newUser.name,
      newUser.email,
      newUser.admin
    );

    const user = {
      _id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      admin: newUser.admin,
      createAt: newUser.createdAt,
      accessToken,
    };

    res
      .status(201)
      .json({ message: "Admin user created successfuly", data: user });
  } else {
    res.status(400).json({ error: "Invalid admin user data received" });
  }
};
