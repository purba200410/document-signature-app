import express from "express";

import upload from "../config/multer.js";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  uploadDocument,
  getMyDocuments,
  getDocumentById,
} from "../controllers/document.controller.js";

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  upload.single("document"),
  uploadDocument
);

router.get(
  "/",
  authMiddleware,
  getMyDocuments
);

router.get(
  "/:id",
  authMiddleware,
  getDocumentById
);

export default router;