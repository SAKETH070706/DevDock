import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

import {
    generateOTP,
    storeOTP,
    verifyOTP,
    deleteOTP,

    storeRegistrationData,
    getRegistrationData,
    deleteRegistrationData,

    markEmailVerified,
    isEmailVerified,
    removeVerifiedFlag,

    storeResetOTP,
    verifyResetOTP,
    deleteResetOTP
} from "./otpService.js";
import {
    sendOTPEmail,
    sendPasswordResetEmail
} from "./emailService.js";

const generateToken=(userId)=>
{
    return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:'30d'});
};

export const sendOTP=async(email,contact)=>
{
    const existingEmail=await User.findOne({email});
    if(existingEmail)    {
        throw new Error("Email already registered");
    }
    const existingContact=await User.findOne({contact});
    if(existingContact)    {
        throw new Error("Contact number already registered");
    }

    const otp=generateOTP();
    await storeOTP(email,otp);
    await storeRegistrationData(email,contact);
    await sendOTPEmail(email,otp);

    return {
        success:true,
        message:"OTP sent to email"
    };
};


export const resendOTP=async(email)=>
{
    const registrationData=await getRegistrationData(email);
    if(!registrationData)
    {
        throw new Error("registration session expired. Please start the registration process again.");
    }

     const otp=generateOTP();
    await storeOTP(email,otp);
    await sendOTPEmail(email,otp);

    return {
        success:true,
        message:"OTP resent to email"
    };
};


export const verifyEmailOTP = async (
    email,
    otp
) => {

    const isValid =
        await verifyOTP(email, otp);

    if (!isValid) {
        throw new Error(
            "Invalid OTP"
        );
    }

    await deleteOTP(email);

    await markEmailVerified(email);

    return {
        success: true,
        message: "Email verified"
    };
};


export const registerUser = async (
    email,
    username,
    password
) => {

    const verified =
        await isEmailVerified(email);

    if (!verified) {
        throw new Error(
            "Email not verified"
        );
    }

    const registrationData =
        await getRegistrationData(email);

    if (!registrationData) {
        throw new Error(
            "Registration session expired"
        );
    }

    const hashedPassword =
        await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        contact:
            registrationData.contact,
        password:
            hashedPassword
    });

    await deleteRegistrationData(
        email
    );

    await removeVerifiedFlag(
        email
    );

    return {
        success: true,
        message:
            "Registration successful",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    };
};

export const loginUser = async (
    email,
    password
) => {

    const user =
        await User.findOne({ email });

    if (!user) {
        throw new Error(
            "Invalid credentials"
        );
    }

    const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!isMatch) {
        throw new Error(
            "Invalid credentials"
        );
    }

    const token =
        generateToken(user._id);

    return {
        token,
        user
    };
};

export const forgotPassword = async (
    email
) => {

    const user =
        await User.findOne({ email });

    if (!user) {
        throw new Error(
            "User not found"
        );
    }

    const otp = generateOTP();

    await storeResetOTP(
        email,
        otp
    );

    await sendPasswordResetEmail(
        email,
        otp
    );

    return {
        success: true,
        message:
            "Password reset OTP sent"
    };
};

export const resetPassword = async (
    email,
    otp,
    newPassword
) => {

    const validOTP =
        await verifyResetOTP(
            email,
            otp
        );

    if (!validOTP) {
        throw new Error(
            "Invalid OTP"
        );
    }

    const hashedPassword =
        await bcrypt.hash(
            newPassword,
            10
        );

    await User.findOneAndUpdate(
        { email },
        {
            password:
                hashedPassword
        }
    );

    await deleteResetOTP(email);

    return {
        success: true,
        message:
            "Password reset successful"
    };
};