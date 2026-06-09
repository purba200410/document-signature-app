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

export const addParticipant = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const { email, role } = req.body;

    const document =
      await prisma.document.findUnique({
        where: { id },
      });

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    if (
      document.ownerId !== req.user.userId
    ) {
      return res.status(403).json({
        message:
          "Only owner can add participants",
      });
    }

    const user =
      await prisma.user.findUnique({
        where: { email },
      });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.id === document.ownerId) {
    return res.status(400).json({
        message:
            "Owner cannot be a participant",
    });
    }
    const existingParticipant =
  await prisma.participant.findFirst({
    where: {
      documentId: id,
      userId: user.id,
    },
  });

if (existingParticipant) {
  return res.status(400).json({
    message:
      "Participant already added",
  });
}
    const participant =
      await prisma.participant.create({
        data: {
          documentId: id,
          userId: user.id,
          role,
        },
      });

      await prisma.auditLog.create({
  data: {
    action: "PARTICIPANT_ADDED",
    documentId: id,
    userId: req.user.userId,
  },
});

    res.status(201).json({
      message:
        "Participant added successfully",
      participant,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getParticipants = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const document =
      await prisma.document.findUnique({
        where: { id },
      });

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    const participants =
      await prisma.participant.findMany({
        where: {
          documentId: id,
        },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

    res.status(200).json({
      participants,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};