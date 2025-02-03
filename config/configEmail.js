import sendgridMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();
const baseUrlServer = process.env.BASE_URL_SERVER;
const emailApiKey = process.env.SENDGRID_API_KEY;
const verifiedSender = process.env.EMAIL_SENDER;
sendgridMail.setApiKey(emailApiKey);

export const sendVerificationEmail = (
  emailRecipient,
  verificationToken,
  emailSubject = "Email Verification"
) => {
  const msg = {
    to: emailRecipient,
    from: verifiedSender,
    subject: emailSubject,
    text: `Click the link to verify your email: ${baseUrlServer}/users/verify/${verificationToken}`,
    html: `<strong>Click the link to verify your email: <a href="${baseUrlServer}/users/verify/${verificationToken}">Verify Email</a></strong>`,
  };
  console.log(msg.text);
  sendgridMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
