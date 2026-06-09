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

export const getMyDocuments = async (
  req,
  res
) => {
  try {
    const documents =
      await prisma.document.findMany({
        where: {
          ownerId: req.user.userId,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    res.status(200).json({
      documents,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getDocumentById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const document =
      await prisma.document.findFirst({
        where: {
          id,
          ownerId: req.user.userId,
        },
      });

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    res.status(200).json({
      document,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};