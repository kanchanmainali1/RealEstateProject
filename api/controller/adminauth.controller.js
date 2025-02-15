import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

// Register a new admin
export const registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin user
    const newAdmin = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        isAdmin: true, // Set this user as an admin
      },
    });

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error("Error registering admin:", err);

    // Handle duplicate email/username error
    if (err.code === "P2002") {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    res.status(500).json({ message: "Failed to register admin" });
  }
};

// Admin login
export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    // Check if the admin exists
    const admin = await prisma.user.findUnique({
      where: { username },
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the user is an admin
    if (!admin.isAdmin) {
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const age = 1000 * 60 * 60 * 24 * 7; // 1 week
    const token = jwt.sign(
      {
        id: admin.id,
        isAdmin: true,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    // Remove password from the response
    const { password: adminPassword, ...adminInfo } = admin;

    // Set the token in a cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        // secure: true, // Uncomment in production (requires HTTPS)
        maxAge: age,
      })
      .status(200)
      .json(adminInfo);
  } catch (err) {
    console.error("Error during admin login:", err);
    res.status(500).json({ message: "Failed to login" });
  }
};

// Admin logout
export const adminLogout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout successful" });
};