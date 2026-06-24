import {sendOTP,resendOTP,verifyEmailOTP,registerUser,loginUser,forgotPassword,resetPassword} from "../services/authService.js";

export const sendOTPController =async(req,res)=>
{
    try{
        const {email,contact} =req.body;
        const result=await sendOTP(email,contact);
        res.status(200).json(result);
    }
    catch(error)
    {
        res.status(400).json({
            success:false,
            message:error.message
        });
    }
};

export const resendOTPController=async(req,res)=>
{
    try{
        const {email}=req.body;
        const result=await resednOTP(email);
        res.status(200).json(result);
    }
    catch(error){
      res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const verifyOTPController=async (req,res)=>
{
    try{
        const {email,otp}= req.body;
        const result=await verifyEmailOTP(email,otp);
        res.status(200).json(result);
    }
    catch(error)
    {
         res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

export const registerController=async(req,res)=>{
    try{
        const {email,username,password}=req.body;
        const result=await registerUser(email,username,password);
        res.status(201).json(result);
    }
    catch(error)
    {
                res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

export const loginController=async(req,res)=>{
    try{
        const{email,password}=req.body;
        const result=await loginUser(email,password);
        res.status(200).json(result);
    }
    catch(error)
    {
         res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

export const forgotPasswordController=async(req,res)=>{
    try{

    const { email } = req.body;

        const result =
            await forgotPassword(email);

        res.status(200).json(result);

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message
        });

    }
};


export const resetPasswordController = async (
    req,
    res
) => {
    try {

        const {
            email,
            otp,
            newPassword
        } = req.body;

        const result = await resetPassword(
            email,
            otp,
            newPassword
        );

        return res.status(200).json(result);

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }
};

export const getCurrentUser = async (
    req,
    res
) => {

    return res.status(200).json({
        success: true,
        user: req.user
    });

};


