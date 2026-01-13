const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phone: {
    type: String
  },

  role: {
    type: String,
    enum: ["student", "owner", "admin"],
    default: "student"
  },

  name: String,

  isVerified: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;