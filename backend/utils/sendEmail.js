// for sending the mail to the user for password reset request
import nodemailer from 'nodemailer'
export const sendEmail = async(options)=>{
    const emailTransporter=nodemailer.createTransport({
        service:process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_EMAIL, //my-email
            pass: process.env.SMTP_PASSWORD //my-password
        }
    })

    const mailOptions = {
        from : process.env.SMTP_EMAIL,
        to:options.email, //the user's email who is requesting
        subject:options.subject,
        text:options.mailContent
    }

    await emailTransporter.sendMail(mailOptions)
}