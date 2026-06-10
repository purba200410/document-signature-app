import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  createSignatureProfile,
  getMySignatureProfile,
  updateSignatureProfile,
} from "../controllers/signature.controller.js";

const router = express.Router();

router.post(
  "/profile",
  authMiddleware,
  createSignatureProfile
);

router.get(
  "/profile",
  authMiddleware,
  getMySignatureProfile
);

router.put(
  "/profile",
  authMiddleware,
  updateSignatureProfile
);

export default router;