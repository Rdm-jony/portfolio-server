const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");
require("dotenv").config();

const sendMail = async ({ to, subject, templateName, templateData }) => {
  const templatePath = path.join(__dirname, "ejsTemplate", `${templateName}.ejs`);
  const html = await ejs.renderFile(templatePath, templateData);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html
  });

  console.log(`✉️ Email sent to ${to}: ${info.messageId}`);
};

module.exports = { sendMail };
