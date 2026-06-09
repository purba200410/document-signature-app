import prisma from "../config/prisma.js";

export const uploadDocument = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const document =
      await prisma.document.create({
        data: {
          title: req.file.originalname,
          originalFileUrl: req.file.path,
          ownerId: req.user.userId,
        },
      });

    res.status(201).json({
      message: "Document uploaded",
      document,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};