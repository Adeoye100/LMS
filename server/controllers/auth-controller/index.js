const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("../../helpers/firebase-admin"); // Import the Firebase Admin SDK

const registerUser = async (req, res) => {
  const { userName, userEmail, password, role } = req.body;

  const existingUser = await User.findOne({
    $or: [{ userEmail }, { userName }],
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User name or user email already exists",
    });
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    userName,
    userEmail,
    role,
    password: hashPassword,
  });

  await newUser.save();

  // Set custom claim for the new user if they are an instructor
  if (role === 'instructor') {
    try {
      await admin.auth().setCustomUserClaims(newUser._id.toString(), { role: 'instructor' });
      console.log(`Custom claim set for new user: ${newUser._id}`);
    } catch (error) {
      console.error("Error setting custom claim during registration:", error);
      // This is not a critical failure, so we just log it and continue
    }
  }

  return res.status(201).json({
    success: true,
    message: "User registered successfully!",
  });
};

const loginUser = async (req, res) => {
  const { userEmail, password } = req.body;

  const checkUser = await User.findOne({ userEmail });

  if (!checkUser || !(await bcrypt.compare(password, checkUser.password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // **Firebase Custom Claim Logic**
  // If the user is an instructor, ensure their custom claim is set.
  if (checkUser.role === 'instructor') {
    try {
      // We use the user's ID from the database to set the claim in Firebase Auth.
      // This links our database user with the Firebase user.
      await admin.auth().setCustomUserClaims(checkUser._id.toString(), { role: 'instructor' });
      console.log(`Custom claim verified for instructor: ${checkUser._id}`);
    } catch (error) {
      console.error("Error setting custom claim during login:", error);
      // If this fails, the user can still log in, but they won't be able to upload files.
      // You might want to return an error here in a production environment.
    }
  }

  const accessToken = jwt.sign(
    {
      _id: checkUser._id,
      userName: checkUser.userName,
      userEmail: checkUser.userEmail,
      role: checkUser.role,
    },
    process.env.JWT_SECRET || "adeoye",
    { expiresIn: "120m" }
  );

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: {
      accessToken,
      user: {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
      },
    },
  });
};

module.exports = { registerUser, loginUser };
