import nodemailer from 'nodemailer';
import { PASSWORD_RESET_REQUEST_TEMPLATE } from './emailTemplate.js';

// configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
        user: process.env.MAIL_ID || "odiigoindia@gmail.com",
        pass: process.env.MAIL_PASSWORD
    }
});

// send mail
const sendResetEmail = async (admin, resetUrl) => {
    try {

        // generated using tabular
        const emailContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetUrl}', resetUrl);

        const mailOptions = {
            from: process.env.MAIL_ID || "sample@gmail.com",
            to: admin,
            subject: 'Password Reset Request',
            html: emailContent
        }

        await new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    resolve(info);
                }
            });
        });    
    } catch (error) {
        console.error("Mail not sent: ", error);
        return null;
    }
}

export { sendResetEmail };