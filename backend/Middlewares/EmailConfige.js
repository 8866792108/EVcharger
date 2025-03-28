const nodemailer = require("nodemailer");
const { AdminEmail, AcceptedPayment, RejectedPayment, RequestAccept, RequestReject } = require("../View/EmailAdmin");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: "sanjaychilgani119@gmail.com",
        pass: "qbatmvepdokkhret",
    },
});


const sendcode = (code) => {

    const Verification_Email_Template = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
              }
              .container {
                  max-width: 600px;
                  margin: 30px auto;
                  background: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                  overflow: hidden;
                  border: 1px solid #ddd;
              }
              .header {
                  background-color: #4CAF50;
                  color: white;
                  padding: 20px;
                  text-align: center;
                  font-size: 26px;
                  font-weight: bold;
              }
              .content {
                  padding: 25px;
                  color: #333;
                  line-height: 1.8;
              }
              .verification-code {
                  display: block;
                  margin: 20px 0;
                  font-size: 22px;
                  color: #4CAF50;
                  background: #e8f5e9;
                  border: 1px dashed #4CAF50;
                  padding: 10px;
                  text-align: center;
                  border-radius: 5px;
                  font-weight: bold;
                  letter-spacing: 2px;
              }
              .footer {
                  background-color: #f4f4f4;
                  padding: 15px;
                  text-align: center;
                  color: #777;
                  font-size: 12px;
                  border-top: 1px solid #ddd;
              }
              p {
                  margin: 0 0 15px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">Verify Your Email</div>
              <div class="content">
                  <p>Hello,</p>
                  <p>Thank you for signing up! Please confirm your email address by entering the code below:</p>
                  <span class="verification-code">${code}</span>
                  <p>If you did not create an account, no further action is required. If you have any questions, feel free to contact our support team.</p>
              </div>
              <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `;

    return Verification_Email_Template;
}


const SendVerificationCode = async (email, VerificationCode) => {
    try {
        const response = await transporter.sendMail({
            from: '"EV Charging Services" <sanjaychilgani119@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Verify Your Email", // Subject line
            text: "Verify Your Email", // plain text body
            html: sendcode(VerificationCode), // html body
        });
        console.log("Email Send successfully", response);
    } catch (error) {
        console.log("email Error handling :: ", error)
    }
}

const PaymentVerification = async (email, orderId, branchId, date, amount, method, transaction, slots) => {
    try {
        const response = await transporter.sendMail({
            from: '"Welcome To VoltHub" <sanjaychilgani119@gmail.com>', // sender address
            to: "sanjaychilgani119@gmail.com", // list of receivers
            subject: "Verify Your Email", // Subject line
            text: "Verify Your Email", // plain text body
            html: AdminEmail(email, orderId, branchId, date, amount, method, transaction, slots), // html body
        });
        console.log("Email Send successfully", response);
    } catch (error) {
        console.log("email Error handling :: ", error)
    }
}
const SendAcceptedPayment = async (order, email, action) => {
    try {
        const response = await transporter.sendMail({
            from: '"Welcome To VoltHub" <sanjaychilgani119@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Verify Your Email",
            text: "Verify Your Email",
            html: action === "Accepted" && AcceptedPayment(order) || action === "Rejected" && RejectedPayment(order),
        });
        console.log("Email Send successfully", response);
    } catch (error) {
        console.log("email Error handling :: ", error)
    }
}
const SendRequestJoinWithUs = async (Request, email, action) => {
    try {
        const response = await transporter.sendMail({
            from: '"Welcome To VoltHub" <sanjaychilgani119@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Verify Your Email",
            text: "Verify Your Email",
            html: action === "Accepted" && RequestAccept(Request) || action === "Rejected" && RequestReject(Request),
        });
        console.log("Email Send successfully", response);
    } catch (error) {
        console.log("email Error handling :: ", error)
    }
}


module.exports = {
    SendVerificationCode,
    PaymentVerification,
    SendAcceptedPayment,
    SendRequestJoinWithUs
}

// SendVerificationCode("sanjaychilgani119@gmail.com", Math.floor((Math.random() * 1000000) + 1))
