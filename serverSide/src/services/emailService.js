import nodemailer from "nodemailer";
import "dotenv/config";


const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});

export const sendOTPEmail = async (email,otp)=>{
    try{
        const mailOptions ={
            from:process.env.EMAIL_USER,
            to:email,
            subject:"DevDock Email Verification OTP",
            html:
            `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                <h2>DevDock Email Verification</h2>
                <p>Your OTP is: <strong>${otp}</strong></p>
                <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
            </div>
            `
        }
        await transporter.sendMail(mailOptions);

        return true;
    } catch (error) {
        console.error("Error sending OTP email:", error);
        throw error;
    }
}

export const sendPasswordResetEmail = async (email,otp)=>{
    try{
        const mailOptions={
            from:process.env.EMAIL_USER,
            to:email,
            subject:"DevDock Password Reset OTP",
            html:
            `
            <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                <h2>DevDock Password Reset</h2>
                <p>Your OTP is: <strong>${otp}</strong></p>
                <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
            </div>
            `
        }
        await transporter.sendMail(mailOptions);

        return true;
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw error;
    }
}

