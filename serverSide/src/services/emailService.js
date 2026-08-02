import "dotenv/config";
import Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sender = {
  name: process.env.SENDER_NAME,
  email: process.env.SENDER_EMAIL,
};

export const sendOTPEmail = async (email, otp) => {
  try {
    await apiInstance.sendTransacEmail({
      sender,
      to: [{ email }],
      subject: "DevDock Email Verification OTP",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>DevDock Email Verification</h2>
          <p>Your OTP is: <strong>${otp}</strong></p>
          <p>This OTP is valid for 10 minutes.</p>
          <p>Please do not share it with anyone.</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, otp) => {
  try {
    await apiInstance.sendTransacEmail({
      sender,
      to: [{ email }],
      subject: "DevDock Password Reset OTP",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>DevDock Password Reset</h2>
          <p>Your OTP is: <strong>${otp}</strong></p>
          <p>This OTP is valid for 10 minutes.</p>
          <p>Please do not share it with anyone.</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};