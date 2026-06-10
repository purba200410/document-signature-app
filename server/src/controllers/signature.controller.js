import prisma from "../config/prisma.js";

export const createSignatureProfile = async (
  req,
  res
) => {
  try {
    const { fullName, initials, fontFamily } =
      req.body;

    const existingProfile =
      await prisma.signatureProfile.findUnique({
        where: {
          userId: req.user.userId,
        },
      });

    if (existingProfile) {
      return res.status(400).json({
        message:
          "Signature profile already exists",
      });
    }

    const profile =
      await prisma.signatureProfile.create({
        data: {
          userId: req.user.userId,
          fullName,
          initials,
          fontFamily,
        },
      });

    res.status(201).json({
      message:
        "Signature profile created",
      profile,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMySignatureProfile =
  async (req, res) => {
    try {
      const profile =
        await prisma.signatureProfile.findUnique({
          where: {
            userId: req.user.userId,
          },
        });

      if (!profile) {
        return res.status(404).json({
          message:
            "Signature profile not found",
        });
      }

      res.status(200).json({
        profile,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server error",
      });
    }
  };

  export const updateSignatureProfile =
  async (req, res) => {
    try {
      const {
        fullName,
        initials,
        fontFamily,
      } = req.body;

      const profile =
        await prisma.signatureProfile.findUnique({
          where: {
            userId: req.user.userId,
          },
        });

      if (!profile) {
        return res.status(404).json({
          message:
            "Signature profile not found",
        });
      }

      const updatedProfile =
        await prisma.signatureProfile.update({
          where: {
            userId: req.user.userId,
          },
          data: {
            fullName,
            initials,
            fontFamily,
          },
        });

      res.status(200).json({
        message:
          "Signature profile updated",
        profile: updatedProfile,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Server error",
      });
    }
  };