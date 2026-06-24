import redis from '../config/redis.js';

const OTP_EXPIRATION_TIME = 10 * 60; // 10 minutes in seconds
const VERIFIED_OTP_EXPIRATION_TIME = 10 * 60; // 10 minutes in seconds

export const generateOTP =()=>
{
    return Math.floor(100000 + Math.random() *900000).toString();
};

export const storeOTP=async(email,otp)=>
{
    const key=`otp:${email}`;
    await redis.set(key,otp,'EX',OTP_EXPIRATION_TIME);
};

export const getOTP=async(email)=>
{
    const key=`otp:${email}`;
    return await redis.get(key);
};

export const deleteOTP=async(email)=>
{
    const key=`otp:${email}`;
    await redis.del(key);
};

export const verifyOTP = async(email, otp) => {
    const storedOTP = await getOTP(email);

    return storedOTP === otp;
};

export const storeRegistrationData=async(email,contact)=>
{
    const key=`register:${email}`;
    await redis.set(key,JSON.stringify({contact}),'EX',OTP_EXPIRATION_TIME);
};

export const getRegistrationData=async(email)=>
{
    const key=`register:${email}`;
    const data=await redis.get(key);
    return data ? JSON.parse(data) : null;
};

export const deleteRegistrationData=async(email)=>
{
    const key=`register:${email}`;
    await redis.del(key);
};

export const markEmailVerified=async(email)=>
{
    const key=`verified:${email}`;
    await redis.set(key,'true','EX',VERIFIED_OTP_EXPIRATION_TIME);
};

export const isEmailVerified=async(email)=>
{
    const key=`verified:${email}`;
    const result=await redis.get(key);
    return result === 'true';
};

export const removeVerifiedFlag=async(email)=>
{
    const key=`verified:${email}`;
    await redis.del(key);
};

export const storeResetOTP=async(email,otp)=>{
    const key=`reset:${email}`;
    await redis.set(key,otp,'EX',OTP_EXPIRATION_TIME);
}

export const getResetOTP=async(email)=>{
    const key=`reset:${email}`;
    return await redis.get(key);
}

export const deleteResetOTP=async(email)=>{
    const key=`reset:${email}`;
    await redis.del(key);
}

export const verifyResetOTP = async(email, otp) => {
    const storedOTP = await getResetOTP(email);

    return storedOTP === otp;
};


