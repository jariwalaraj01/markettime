const nodemailer = require("nodemailer");

/**
 * This function use for sending email
 * @param {string} email 
 * @param {number} otp 
 * @returns 
 */
exports.sendMail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL,
                pass: process.env.PASSWORD
            }
        });

        const info = await transporter.sendMail({
            from: process.env.GMAIL,
            to: email,
            subject: "OTP - MarketTime",
            html: `Your OTP is <b>${otp}</b>`,
        });

        return {
            status: 1,
            message: info.messageId
        }
    } catch (err) {
        return {
            status: 0,
            error: err
        }
    }
}
