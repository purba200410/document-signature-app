import express from "express";

import upload from "../config/multer.js";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  uploadDocument,
  getMyDocuments,
  getDocumentById,
  addParticipant,
  getParticipants,
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
  "/:id/participants",
  authMiddleware,
  getParticipants
);

router.get(
  "/:id",
  authMiddleware,
  getDocumentById
);

router.post(
  "/:id/participants",
  authMiddleware,
  addParticipant
);
export default router;