import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/Admin.js"; // Import the Admin model
import bcrypt from "bcrypt"; // Import bcrypt for password hashing

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const addAdmin = async (name, username, password, email) => {
  try {
    const adminExists = await Admin.findOne({ username });

    if (adminExists) {
      console.log("⚠️ Admin already exists with this username");
      return;
    }

    const emailExists = await Admin.findOne({ email });
    if (emailExists) {
      console.log("⚠️ Admin already exists with this email");
      return;
    }

    const newAdmin = new Admin({ name, username, password, email, role: "admin" });
    await newAdmin.save();
    console.log("✅ Admin added successfully");
  } catch (error) {
    console.error("❌ Error adding admin:", error.message);
  } finally {
    mongoose.connection.close();
  }
};

// Run the function (Change these values as needed)
addAdmin("Admin", "admin12", "Admin@1234", "admin@gmail.com");
