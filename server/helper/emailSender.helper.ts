import nodemailer from 'nodemailer';

interface ISendEmail {
    to: string;
    html: string;
    subject: string;
}

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmail = async (values: ISendEmail) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.COMPANY_NAME,
            to: values.to,
            subject: values.subject,
            html: values.html,
        });

        console.log("Mail send successful: -> ",info);
    } catch (error) {
        console.error('Email', error);
    }
};
