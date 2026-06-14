import jwt from "jsonwebtoken";

export const generateInviteToken = (payload: {
  email: string;
  documentId: string;
  participantId: string;
}) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "2d",
  });
};

export const verifyInviteToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};