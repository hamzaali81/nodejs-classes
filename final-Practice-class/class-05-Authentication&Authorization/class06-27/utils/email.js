const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config({ path: '../config.env' });

 const sendEmail = async(options) =>{
    console.log(options);
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        // service: 'Gmail',
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        // port
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })
    // 2) Define the email options
    const mailOptions = {
        from: 'hamza ali <test@123.io>',
        to: options.email,
        subject: options.subject,
        text: options.message
        //html:
    }
    // 3) Actually send the email
   await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;
