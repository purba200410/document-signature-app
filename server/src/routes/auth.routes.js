import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  register,
  login,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get(
  "/profile",
  authMiddleware,
  (req, res) => {
    res.json({
      message: "Protected route",
      user: req.user,
    });
  }
);

export default router;