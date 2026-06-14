import nodemailer from "nodemailer";

export const sendInvitationEmail = async (
  email: string,
  link: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Doc Sign App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "You are invited to sign a document",
    html: `
      <div style="font-family: Arial;">
        <h2>Document Signature Invitation</h2>
        <p>You have been invited to sign a document.</p>

        <a href="${link}" 
           style="padding:10px 15px;background:#2563eb;color:white;text-decoration:none;border-radius:5px;">
           Open Document
        </a>

        <p style="margin-top:20px;color:gray;">
          If button doesn't work, copy link: ${link}
        </p>
      </div>
    `,
  });
};