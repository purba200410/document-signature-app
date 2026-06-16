import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import prisma from "../config/prisma.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const strongPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

if (!strongPassword.test(password)) {
  return res.status(400).json({
    message:
      "Password must contain uppercase, lowercase, number and special character",
  });
}

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const acceptInvite = async (req, res) => {
  try {
    const { token } = req.body;

    // 1. Validate secret first
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({
        message: "JWT secret not configured",
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, secret);

    const { email, participantId } = decoded;

    // 3. Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 4. Link participant if user exists
    if (user) {
      await prisma.participant.update({
        where: { id: participantId },
        data: {
          userId: user.id,
        },
      });
    }

    return res.json({
      message: "Invite accepted successfully",
    });

  } catch (err) {
    console.error(err);
    return res.status(400).json({
      error: "Invalid or expired invite",
    });
  }
};