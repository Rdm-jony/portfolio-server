/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer"
import path from "path"
import ejs from "ejs";
import dotenv from "dotenv"
import { fileURLToPath } from "url";

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})



export const sendMail = async ({
    subject,
    templateName,
    templateData
}) => {
    try {
        const templatePath = path.resolve(__dirname, `../ejsTemplate/${templateName}.ejs`);
        const html = await ejs.renderFile(templatePath, templateData)
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: process.env.SMTP_FROM,
            subject: subject,
            html: html
        })
        console.log(`\u2709\uFE0F Email sent to : ${info.messageId}`);

    } catch (error) {
        console.log(error)
    }
}