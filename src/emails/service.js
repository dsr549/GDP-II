const nodemailer = require("nodemailer");

const sendOtpEmail = (mail, randomdigit) => {
    const passwordMsg = {
        from: "vasileveva.ap@gmail.com",
        to: mail,
        subject: `${randomdigit} is your OTP for SIMS`,
        html: `<div><h4>Hi, Here is the One Time Password : <b>${randomdigit}</b> to login into your account in student internship portal <br> \n kindly enter the OTP\n <br> <br> Note: The OTP is only valid for fifteen minutes after that the OTP expires</h4></div>`
    }

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "vasileveva.ap@gmail.com",
            pass: "oflhgowkipsxjroh "
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
