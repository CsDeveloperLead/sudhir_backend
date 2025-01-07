import nodemailer from 'nodemailer'


export const notifyAdmin = async (email, message, subject) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: subject,
        text: message,
        replyTo: email
    };

    const info = await transporter.sendMail(mailOptions);
    
    return info;
};

