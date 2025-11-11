const Admin = require("../models/Admin");
const FacultyOD = require("../models/FacultyOD");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signupAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log(`✅ Admin Registered: ${newAdmin.email}`);

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email },
    });
  } catch (error) {
    console.error("❌ Admin Signup Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to register admin",
      error: error.message,
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`✅ Admin Logged In: ${admin.email}`);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: { id: admin._id, name: admin.name, email: admin.email },
    });
  } catch (error) {
    console.error("❌ Admin Login Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await FacultyOD.find().sort({ createdAt: -1 });

    console.log(`📊 Total Submissions Retrieved: ${submissions.length}`);

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error) {
    console.error("❌ Error fetching submissions:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch submissions",
      error: error.message,
    });
  }
};

module.exports = { signupAdmin, loginAdmin, getAllSubmissions };
