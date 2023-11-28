const mongoose = require('mongoose');
const { validatePassword } = require('../helpers/authHelper');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      validate : {
        validator : validatePassword,
        message : "Password must incldue special character"
      }
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    loginAttempts : {
        type : Number,
        default : 0,
    },
    role: {
      type: Number,
      default: 0,
    },
    
  },
  { timestamps: true }
);


const User = mongoose.model("users", userSchema);
module.exports = User ;