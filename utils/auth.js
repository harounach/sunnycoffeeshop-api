const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Generate access token
 *
 * @param {string} id
 * @param {string} name
 * @param {string} email
 */
exports.generateToken = (id, name, email, admin) => {
  return jwt.sign(
    {
      id,
      name,
      email,
      admin,
    },
    JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

/**
 * Verify token
 *
 * @param {string} token
 * @returns
 */
exports.verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Generate hashed password
 *
 * @param {string} password
 * @returns {string}
 */
exports.generateHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compare password with the hashed password in database
 *
 * @param {string} password
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
exports.comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
