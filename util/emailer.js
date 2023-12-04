const userEmail = require('./protected').emailUser;
const userPassword = require('./protected').emailPassword;

const nodeMailer = require('nodemailer');

const sendEmail = function(arr, subject, body) {
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        auth: {
            user: userEmail,
            pass: userPassword
        }
    });

    const info = {
        from: 'no-reply@efficient-comms.com',
        to: 'will be reset',
        subject: subject,
        html: body
    };

    arr.forEach(email => {
        info.to = email;
        transporter.sendMail(info, (err) => {
            if (err) {
                console.log(err);
            }
        })
    })
}

module.exports = {send: sendEmail};