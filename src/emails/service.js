const nodemailer = require("nodemailer");

const sendOtpEmail = (mail, randomdigit) => {
    const passwordMsg = {
        from: "ihsaspprt@gmail.com",
        to: mail,
        subject: `${randomdigit} is your OTP for IHSA`,
        html: `<div><h4>Hi, Here is the One Time Password : <b>${randomdigit}</b> to login into your account in IHSA <br> \n kindly enter the OTP\n <br> <br> Note: The OTP is only valid for fifteen minutes after that the OTP expires</h4></div>`
    }

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ihsaspprt@gmail.com",
            pass: "najoclxqztuxkwvt"
        }
    });

    return new Promise((resolve, reject) => {
        transporter.sendMail(passwordMsg, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log("Email sent");
                resolve();
            }
        });
    });
};

const sendPassword = (mail, password) => {
    const passwordMsg = {
        from: "ihsaspprt@gmail.com",
        to: mail,
        subject: `${randomdigit} is your OTP for IHSA`,
        html: `<div><h4>Hi, Here is the One Time Password : <b>${randomdigit}</b> to login into your account in student internship portal <br> \n kindly enter the OTP\n <br> <br> Note: The OTP is only valid for fifteen minutes after that the OTP expires</h4></div>`
    }

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ihsaspprt@gmail.com",
            pass: "najoclxqztuxkwvt"
        }
    });

    return new Promise((resolve, reject) => {
        transporter.sendMail(passwordMsg, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log("Email sent");
                resolve();
            }
        });
    });
};

module.exports={
    sendOtpEmail
}
