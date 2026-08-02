import "dotenv/config";
import * as Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
);

export const sendOTPEmail = async (email, otp) => {
    try {
        const emailData = new Brevo.SendSmtpEmail();

        emailData.sender = {
            name: process.env.SENDER_NAME,
            email: process.env.SENDER_EMAIL,
        };

        emailData.to = [
            {
                email,
            },
        ];

        emailData.subject = "DevDock Email Verification OTP";

        emailData.htmlContent = `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2>DevDock Email Verification</h2>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p>This OTP is valid for <strong>10 minutes</strong>.</p>
            <p>Please do not share this OTP with anyone.</p>
        </div>
        `;

        await apiInstance.sendTransacEmail(emailData);

        return true;
    } catch (error) {
        console.error("Error sending OTP email:", error.response?.body || error);
        throw error;
    }
};

export const sendPasswordResetEmail = async (email, otp) => {
    try {
        const emailData = new Brevo.SendSmtpEmail();

        emailData.sender = {
            name: process.env.SENDER_NAME,
            email: process.env.SENDER_EMAIL,
        };

        emailData.to = [
            {
                email,
            },
        ];

        emailData.subject = "DevDock Password Reset OTP";

        emailData.htmlContent = `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
            <h2>DevDock Password Reset</h2>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p>This OTP is valid for <strong>10 minutes</strong>.</p>
            <p>Please do not share this OTP with anyone.</p>
        </div>
        `;

        await apiInstance.sendTransacEmail(emailData);

        return true;
    } catch (error) {
        console.error("Error sending password reset email:", error.response?.body || error);
        throw error;
    }
};