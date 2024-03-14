import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

// User Registration 
export const register = async (req, res) => {
  try {
    // hashing password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      photo: req.body.photo,
    });

    await newUser.save();
    res.status(200).json({ success: true, message: "Successfully Created" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to Create. Try again" });
  }
};

export const login = async (req, res) => {
  const email = req.body.email;

  try {
    const user = await User.findOne({ email });

    // if user doesn't exist
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not Found" });
    }

    // Compare the password
    const checkCorrectPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    // if password is incorrect
    if (!checkCorrectPassword) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect email or password" });
    }

    const { password, role, ...rest } = user._doc;

    // Create JWT Token with the correct expiration
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "15d" }
    );

    // Set the token in the browser cookies and send the response to the client
    res.cookie("accessToken", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days in milliseconds
    });

    res.status(200).json({
      success: true,
      message: "Successfully Login",
      token,
      role,
      data: { ...rest },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed To Login" });
  }
};

