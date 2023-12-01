const User = require("../models/userModel");
const hashPassword = require("../helpers/authHelper");
const JWT = require("jsonwebtoken");
const Orders = require("../models/orderModel");
const Order = require("../models/orderModel");
const { checkPasswordExpiration } = require("../services/passwordExpiration");

// registration of the user
const registerController = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    // validation
    if (!name || !email || !password || !phone || !address || !answer) {
      return res
        .status(400)
        .send({ success: false, message: "Credentials Required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .send({ success: false, message: "Password must be 8 characters" });
    }

    if (password.length > 12) {
      return res.status(400).send({
        success: false,
        message: "Password must not be more than 12 characters",
      });
    }

    if (!hashPassword.validatePassword(password)) {
      console.log("Invalid password:", password);
      return res.send({
        message:
          "Password must include special character, Uppercase, lowercase and a number",
      });
    }

    console.log("here");

    // check the existing user
    const existingUser = await User.findOne({ email });
    

    if (existingUser) {
      return res.send({
        success: false,
        message: "User already registered",
      });
    }

    const hashedPassword = await hashPassword.hashedPassword(password);

    // save
    const user = await new User({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

  
    return res.status(201).send({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Registration",
      error :  error.message
    });
  }
};

// LOGIN OF THE USER
const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email not registered",
      });
    }

    // Check if the user is blocked
    if (user.loginAttempts >= 3) {
      return res.status(403).send({
        success: false,
        message: "User is blocked. Too many failed login attempts.",
      });
    }

    // Check if the password has expired
    if (checkPasswordExpiration(user.passwordLastModified)) {
      return res.status(401).send({
        success: false,
        message: "Password has expired. Please reset your password.",
      });
    }

    // compare the password with hashed password
    const match = await hashPassword.comparePassword(password, user.password);
    if (!match) {
      // Increment loginAttempts on failed login
      await User.findByIdAndUpdate(user._id, { $inc: { loginAttempts: 1 } });

      return res.status(401).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // Reset loginAttempts on successful login
    await User.findByIdAndUpdate(user._id, { loginAttempts: 0 });

    // create a token if all set
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Login",
    });
  }
};

// forgot password controller
const forgotPasswordController = async (req, res, next) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({
        message: "Email is required",
      });
    }
    if (!answer) {
      res.status(400).send({
        message: "answer is required",
      });
    }
    if (!newPassword) {
      res.status(400).send({
        message: "New Password is required",
      });
    }
    // check the email and password
    const user = await User.findOne({ email, answer });
    // validation
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }
    const hashed = await hashPassword.hashedPassword(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashed , passwordLastModified : new Date() });
    res.status(200).send({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

const testController = async (req, res, next) => {
  res.send("protected");
};

const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;

    const user = await User.findById(req.user._id);

    // password
    if (password && password.length < 6)
      return res.json({ error: "password is required and 6 charater long" });

    const hashedPassword = password
      ? await hashPassword.hashedPassword(password)
      : undefined;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
        email: email,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating user profile",
      error,
    });
  }
};

// order
const getOrdersController = async (req, res) => {
  try {
    const orders = await Orders.find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

const getOrdersAllController = async (req, res) => {
  try {
    const orders = await Orders.find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

// order status controller
const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await Orders.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getOrdersAllController,
  orderStatusController,
};
