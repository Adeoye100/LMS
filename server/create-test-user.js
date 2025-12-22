const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/lms"
    );
    console.log("Connected to MongoDB");

    const instructorEmail = "instructor@example.com";
    const instructorPassword = "password123";

    // Check if user already exists
    const existingUser = await User.findOne({ userEmail: instructorEmail });
    if (existingUser) {
      console.log(`Instructor user (${instructorEmail}) already exists.`);
      return;
    }

    // Create test user
    const hashedPassword = await bcrypt.hash(instructorPassword, 10);
    const testUser = new User({
      userName: "Instructor User",
      userEmail: instructorEmail,
      password: hashedPassword,
      role: "instructor", // Set role to 'instructor'
    });

    await testUser.save();
    console.log("Instructor user created successfully!");
    console.log(`Email: ${instructorEmail}`);
    console.log(`Password: ${instructorPassword}`);
  } catch (error) {
    console.error("Error creating test user:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

createTestUser();
