const userEmail = require('./protected').emailUser;
const userPassword = require('./protected').emailPassword;

const nodeMailer = require('nodemailer');

module.exports = sendEmail = function(arr, subject, body) {
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        auth: {
            user: userEmail,
            pass: userPassword
        }
    });

    const info = {
        from: 'Matt <matt.bilyeu1@gmail.com>',
        to: 'will be reset',
        subject: subject,
        html: body
    };

    arr.forEach(email => {
        info.to = email;
        transporter.sendMail(info, (err) => {
            console.log(err);
        })
    })
}