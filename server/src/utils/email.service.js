import nodemailer from "nodemailer";

export const sendInvitationEmail = async (
    email,
    link
) => {
    console.log("FUNCTION CALLED WITH:", {
        email,
        link,
    });
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
        subject: "📄 Digital Signature Request",
        html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">

  <div style="background: #2563eb; color: white; padding: 24px; text-align: center;">
    <h1 style="margin:0;">Doc Sign App</h1>
    <p style="margin-top:8px;">
      Secure Digital Document Signing
    </p>
  </div>

  <div style="padding: 30px;">

    <h2 style="color:#111827;">
      Document Signature Request
    </h2>

    <p style="color:#4b5563; line-height:1.6;">
      You have been invited to participate in a document signing process.
    </p>

    <p style="color:#4b5563; line-height:1.6;">
      Please review the document and complete your required action by clicking the button below.
    </p>

    <div style="text-align:center; margin:30px 0;">
      <a
        href="${link}"
        style="
          background:#2563eb;
          color:white;
          padding:14px 28px;
          text-decoration:none;
          border-radius:8px;
          display:inline-block;
          font-weight:bold;
        "
      >
        Open Document
      </a>
    </div>

    <p style="font-size:14px;color:#6b7280;">
      If the button above does not work, copy and paste this link into your browser:
    </p>

    <p style="
      word-break: break-all;
      background:#f3f4f6;
      padding:10px;
      border-radius:6px;
      font-size:13px;
    ">
      ${link}
    </p>

    <hr style="margin:25px 0;border:none;border-top:1px solid #e5e7eb;" />

    <p style="font-size:13px;color:#9ca3af;">
      This invitation was sent through the Doc Sign App digital signature platform.
    </p>

  </div>

</div>
`,
    });
};