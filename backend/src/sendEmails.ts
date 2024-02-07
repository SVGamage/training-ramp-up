import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();
const frontendUrl = process.env.FRONTEND_URL!;
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_SENDER_ADDRESS,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

export const sendMail = async (
  transporter: any,
  recieverEmail: string,
  role: string,
  name: string,
  token: string
): Promise<void> => {
  const link = `${frontendUrl}/passwordcreate`;
  const mailOptions = {
    from: {
      name: 'Ramp-up',
      address: process.env.EMAIL_SENDER_ADDRESS
    },
    to: recieverEmail,
    subject: 'Account Registration - Password Creation Link ',
    text: 'This is a test email',
    html: `<P>Dear ${name},</P>
    <P>You have been added as an ${role} to our system. Please click the following link to create your password and access your account: </P>
    <P><a href='${link}?token=${token}'>Password Creation Link</a></P>
    <P>Please note that the password creation link is valid for one-time use only. Ensure that you use it promptly to set up your password. </P>
    <P>Best Regards,</P>
    <P>Team Ramp-up</P>
    `
  };

  await new Promise<void>((resolve, reject) => {
    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error != null) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};
