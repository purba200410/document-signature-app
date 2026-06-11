import prisma from "../config/prisma.js";
import path from "path";
import { addSignatureToPdf }
from "../services/pdf.service.js";
/* =========================
   UPLOAD DOCUMENT
========================= */
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const document = await prisma.document.create({
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
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET MY DOCUMENTS
========================= */
export const getMyDocuments = async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      where: {
        ownerId: req.user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET DOCUMENT BY ID
========================= */
export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findFirst({
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

    res.status(200).json({ document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   ADD PARTICIPANT (FIXED)
========================= */
export const addParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role } = req.body;

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    if (document.ownerId !== req.user.userId) {
      return res.status(403).json({
        message: "Only owner can add participants",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.id === document.ownerId) {
      return res.status(400).json({
        message: "Owner cannot be a participant",
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
        message: "Participant already added",
      });
    }

    const participant = await prisma.participant.create({
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

    if (document.status === "DRAFT") {
  await prisma.document.update({
    where: {
      id,
    },
    data: {
      status: "PENDING",
    },
  });
}

    res.status(201).json({
      message: "Participant added successfully",
      participant,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET PARTICIPANTS
========================= */
export const getParticipants = async (req, res) => {
  try {
    const { id } = req.params;

    const participants = await prisma.participant.findMany({
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

    res.status(200).json({ participants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   COMPLETE PARTICIPANT ACTION (DAY 7 CORE)
========================= */
export const completeParticipantAction = async (req, res) => {
  try {
    const { id } = req.params;

    const participant = await prisma.participant.findFirst({
      where: {
        documentId: id,
        userId: req.user.userId,
      },
    });

    if (!participant) {
      return res.status(404).json({
        message: "You are not a participant in this document",
      });
    }

    if (participant.status === "COMPLETED") {
      return res.status(400).json({
        message: "Action already completed",
      });
    }

    const allParticipants = await prisma.participant.findMany({
      where: { documentId: id },
    });

    // WITNESS must wait for SIGNER
    if (participant.role === "WITNESS") {
      const signer = allParticipants.find(
        (p) => p.role === "SIGNER"
      );

      if (signer && signer.status !== "COMPLETED") {
        return res.status(400).json({
          message: "Signer must complete first",
        });
      }
    }

    // AUTHENTICATOR must wait for SIGNER + WITNESS
    if (participant.role === "AUTHENTICATOR") {
      const signer = allParticipants.find(
        (p) => p.role === "SIGNER"
      );

      if (signer && signer.status !== "COMPLETED") {
        return res.status(400).json({
          message: "Signer must complete first",
        });
      }

      const witness = allParticipants.find(
        (p) => p.role === "WITNESS"
      );

      if (witness && witness.status !== "COMPLETED") {
        return res.status(400).json({
          message: "Witness must complete first",
        });
      }
    }

    await prisma.participant.update({
      where: {
        id: participant.id,
      },
      data: {
        status: "COMPLETED",
        actedAt: new Date(),
      },
    });

    let auditAction = "SIGNED";

if (participant.role === "WITNESS") {
  auditAction = "WITNESSED";
}

if (participant.role === "AUTHENTICATOR") {
  auditAction = "AUTHENTICATED";
}

await prisma.auditLog.create({
  data: {
    action: auditAction,
    documentId: id,
    userId: req.user.userId,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
  },
});

    if (participant.role === "SIGNER") {

  const document =
    await prisma.document.findUnique({
      where: {
        id,
      },
    });

  const user =
    await prisma.user.findUnique({
      where: {
        id: req.user.userId,
      },
      include: {
        signatureProfile: true,
      },
    });

  const signerName =
    user.signatureProfile?.fullName ||
    user.name;

  const outputPath =
    `signed/signed-${Date.now()}.pdf`;

  await addSignatureToPdf(
    document.originalFileUrl,
    outputPath,
    signerName
  );

  await prisma.document.update({
    where: {
      id,
    },
    data: {
      signedFileUrl: outputPath,
    },
  });
}



    const updatedParticipants =
  await prisma.participant.findMany({
    where: {
      documentId: id,
    },
  });

const allCompleted =
  updatedParticipants.every(
    (p) => p.status === "COMPLETED"
  );

await prisma.document.update({
  where: {
    id,
  },
  data: {
    status: allCompleted
      ? "COMPLETED"
      : "PARTIALLY_SIGNED",
  },
});

    res.status(200).json({
      message: `${participant.role} completed successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAuditLogs = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const logs =
      await prisma.auditLog.findMany({
        where: {
          documentId: id,
        },

        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },

        orderBy: {
          createdAt: "asc",
        },
      });

    res.status(200).json({
      logs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};