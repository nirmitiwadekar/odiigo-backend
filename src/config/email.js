import nodemailer from 'nodemailer';

// configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    port: 465,
    auth: {
        user: process.env.MAIL_ID || "sample@gmail.com",
        pass: process.env.MAIL_PASSWORD
    }
});

// send mail
const sendResetEmail = async (admin) => {
    try {

        // generated using tabular
        const emailContent = `
            <p>You requested a password reset.</p>
            <p>Click this link to reset your password:</p>
            <a href="http://localhost:5173/reset-password">Reset Password</a>
            <p>This link is valid for 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `

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