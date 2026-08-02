import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (email, otp) => {
  try {
    await resend.emails.send({
      from: "DevDock <onboarding@resend.dev>",
      to: email,
      subject: "DevDock Email Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2>DevDock Email Verification</h2>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, otp) => {
  try {
    await resend.emails.send({
      from: "DevDock <onboarding@resend.dev>",
      to: email,
      subject: "DevDock Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2>DevDock Password Reset</h2>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};