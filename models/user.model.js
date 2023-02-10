const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String },
    refreshToken: { type: String },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = UserModel;
