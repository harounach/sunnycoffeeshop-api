const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    refreshToken: { type: String },
  },
  {
    timestamps: true,
    collection: "scs_users"
  }
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = UserModel;
