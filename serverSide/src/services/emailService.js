import "dotenv/config";
import SibApiV3Sdk from "sib-api-v3-sdk";

const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendOTPEmail = async (email, otp) => {
  try {
    await apiInstance.sendTransacEmail({
      sender: {
        email: process.env.SENDER_EMAIL,
        name: process.env.SENDER_NAME,
      },
      to: [{ email }],
      subject: "DevDock Email Verification OTP",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>DevDock Email Verification</h2>
          <p>Your OTP is: <strong>${otp}</strong></p>
          <p>This OTP is valid for <strong>10 minutes</strong>.</p>
          <p>Please do not share it with anyone.</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error("Error sending OTP:", error.response?.body || error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, otp) => {
  try {
    await apiInstance.sendTransacEmail({
      sender: {
        email: process.env.SENDER_EMAIL,
        name: process.env.SENDER_NAME,
      },
      to: [{ email }],
      subject: "DevDock Password Reset OTP",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>DevDock Password Reset</h2>
          <p>Your OTP is: <strong>${otp}</strong></p>
          <p>This OTP is valid for <strong>10 minutes</strong>.</p>
          <p>Please do not share it with anyone.</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error("Error sending reset OTP:", error.response?.body || error);
    throw error;
  }
};