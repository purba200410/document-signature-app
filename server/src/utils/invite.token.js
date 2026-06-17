import jwt from "jsonwebtoken";

export const generateInviteToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: "2d",
        }
    );
};

export const verifyInviteToken = (token) => {
    return jwt.verify(
        token,
        process.env.JWT_SECRET
    );
};