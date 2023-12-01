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
    passwordLastModified  : {
      type : Date,
      default : Date.now,
     
    }
    
  },

  { timestamps: true }
);


const User = mongoose.model("users", userSchema);
module.exports = User ;