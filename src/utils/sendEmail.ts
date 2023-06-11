var nodemailer = require("nodemailer");

// var mailOptions = {
//   from: "youremail@gmail.com",
//   to: "myfriend@yahoo.com",
//   subject: "Sending Email using Node.js",
//   text: "That was easy!",
// };

export type MailOptions = {
  from?: string;
  to: string;
  subject: string;
  html: string;
};

export default function SendEmail(mailOptions: MailOptions) {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    tls: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  mailOptions.from = process.env.MAIL_USER;
  transporter
    .sendMail(mailOptions)
    .then(() => {})
    .catch(console.error);
}
