import prisma from "../config/prisma.js";
import path from "path";
import { addSignatureToPdf }
  from "../services/pdf.service.js";
import jwt from "jsonwebtoken";
import { generateInviteToken } from "../utils/invite.token.js";
import { sendInvitationEmail } from "../utils/email.service.js";
import fs from "fs";
import { supabase } from "../config/supabase.js";
import { uploadPdfToStorage }
  from "../services/storage.service.js";
import {
  uploadLocalPdfToStorage,
} from "../services/storage.service.js";
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
const fileName =
  `documents/${Date.now()}-${req.file.originalname}`;

const publicUrl =
  await uploadPdfToStorage(
    req.file.buffer,
    fileName
  );
    const document = await prisma.document.create({
      data: {
        title: req.file.originalname,
        originalFileUrl: publicUrl,
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

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    const isOwner =
      document.ownerId === req.user.userId;

    const participant =
      await prisma.participant.findFirst({
        where: {
          documentId: id,
          userId: req.user.userId,
        },
      });

    if (!isOwner && !participant) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    res.status(200).json({
      document,
      isOwner,
      participant,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

/* =========================
   ADD PARTICIPANT (FIXED)
========================= */


export const addParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, role } = req.body;

    // 1. Check document exists
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    // 2. Only owner can add participants
    if (document.ownerId !== req.user.userId) {
      return res.status(403).json({
        message: "Only owner can add participants",
      });
    }

    // 3. Check if user exists (optional now)
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 4. Prevent duplicate participant (by email OR userId)
    const existingParticipant = await prisma.participant.findFirst({
      where: {
        documentId: id,
        email: email,
      },
    });

    if (existingParticipant) {
      return res.status(400).json({
        message: "Participant already invited",
      });
    }

    // 5. Create participant (email-based system)
    const participant = await prisma.participant.create({
      data: {
        documentId: id,
        email,
        role,
        userId: user?.id || null,
      },
    });

    // 6. Create audit log
    await prisma.auditLog.create({
      data: {
        action: "PARTICIPANT_ADDED",
        documentId: id,
        userId: req.user.userId,
      },
    });

    // 7. Update document status if needed
    if (document.status === "DRAFT") {
      await prisma.document.update({
        where: { id },
        data: { status: "PENDING" },
      });
    }

    // 8. Generate invite token
    const token = generateInviteToken({
      email,
      documentId: id,
      participantId: participant.id,
    });

    const inviteLink = `${process.env.CLIENT_URL}/invite?token=${token}`;

    // 9. Send invitation email
    console.log("Invite Link:", inviteLink);
    console.log("Sending email to:", email);

    await sendInvitationEmail(
      email,
      inviteLink
    );

    return res.status(201).json({
      message: "Participant invited successfully",
      participant,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
    });
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

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        signatureProfile: true,
      },
    });

    const signerName = user.signatureProfile?.fullName || user.name;
    const outputPath = `signed/signed-${Date.now()}.pdf`;

    const signatureIndex = allParticipants.filter(
      (p) => p.status === "COMPLETED"
    ).length;

    await addSignatureToPdf(
      document.signedFileUrl || document.originalFileUrl,
      outputPath,
      signerName,
      participant.role,
      signatureIndex
    );


    const signedPdfUrl =
  await uploadLocalPdfToStorage(
    outputPath,
    `signed/signed-${Date.now()}.pdf`
  );

if (fs.existsSync(outputPath)) {
  fs.unlinkSync(outputPath);
}

    const allCompleted = allParticipants.every(
      (p) => p.id === participant.id || p.status === "COMPLETED"
    );

    const auditAction =
      participant.role === "WITNESS"
        ? "WITNESSED"
        : participant.role === "AUTHENTICATOR"
          ? "AUTHENTICATED"
          : "SIGNED";

    await prisma.$transaction([
      prisma.participant.update({
        where: { id: participant.id },
        data: {
          status: "COMPLETED",
          actedAt: new Date(),
        },
      }),
      prisma.auditLog.create({
        data: {
          action: auditAction,
          documentId: id,
          userId: req.user.userId,
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
        },
      }),
      prisma.document.update({
        where: { id },
        data: {
          signedFileUrl: signedPdfUrl,
          status: allCompleted ? "COMPLETED" : "PARTIALLY_SIGNED",
        },
      }),
    ]);

    console.log("PDF generated and database updated successfully:", outputPath);
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

export const downloadSignedDocument = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document || !document.signedFileUrl) {
      return res.status(404).json({
        message: "Signed document not found",
      });
    }

    return res.redirect(document.signedFileUrl);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const totalDocuments =
      await prisma.document.count({
        where: {
          ownerId: userId,
        },
      });

    const completedDocuments =
      await prisma.document.count({
        where: {
          ownerId: userId,
          status: "COMPLETED",
        },
      });

    const pendingDocuments =
      await prisma.document.count({
        where: {
          ownerId: userId,
          NOT: {
            status: "COMPLETED",
          },
        },
      });

    res.json({
      totalDocuments,
      completedDocuments,
      pendingDocuments,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getAssignedDocuments = async (
  req,
  res
) => {
  try {
    const documents =
      await prisma.participant.findMany({
        where: {
          userId: req.user.userId,
        },
        include: {
          document: true,
        },
      });

    res.json({
      documents,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const deleteParticipant = async (req, res) => {
  try {
    const { participantId } = req.params;

    const participant =
      await prisma.participant.findUnique({
        where: {
          id: participantId,
        },
        include: {
          document: true,
        },
      });

    if (!participant) {
      return res.status(404).json({
        message: "Participant not found",
      });
    }

    // Only owner can delete
    if (
      participant.document.ownerId !==
      req.user.userId
    ) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    await prisma.participant.delete({
      where: {
        id: participantId,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "PARTICIPANT_REMOVED",
        documentId:
          participant.documentId,
        userId: req.user.userId,
      },
    });

    return res.json({
      message:
        "Participant removed successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};