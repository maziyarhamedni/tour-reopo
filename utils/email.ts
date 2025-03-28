import nodemailer from 'nodemailer';

const sendEmail = async (options: any) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Tour website <tour@leader.io>', // Default sender
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html: options.html || '', // Optional HTML content
  };

  // 3) Actually send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};
export = sendEmail; // Use default export for consistency
