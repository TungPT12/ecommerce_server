const nodemailer = require('nodemailer');
const getKeyEnvironmentVariable = require('./getKeyEnvironmentVariable');
const winston = require('./winston');

const sendEmail = (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: getKeyEnvironmentVariable('EMAIL'),
            pass: getKeyEnvironmentVariable('EMAIL_PASSWORD'),
        }
    });
    const mailOptions = {
        from: getKeyEnvironmentVariable('EMAIL'),
        to: email,
        subject: subject,
        html: html
    };
    transporter.sendMail(mailOptions).then((info) => {
        // winston.info(`send-email: ${error.message}`)
    }).catch((error) => {
        winston.error(`send-email: ${error.message}`)
    })
}

module.exports = sendEmail;

