import express from "express";

import upload from "../config/multer.js";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  uploadDocument,
} from "../controllers/document.controller.js";

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  upload.single("document"),
  uploadDocument
);

export default router;