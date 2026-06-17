import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  register,
  login,
  acceptInvite,
} from "../controllers/auth.controller.js";

import prisma from "../config/prisma.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.post("/accept-invite", acceptInvite);

router.get(
  "/profile",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        message: "Protected route",
        user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

export default router;