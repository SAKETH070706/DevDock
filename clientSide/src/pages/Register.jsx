import {useState} from "react";
import {sendOTP,verifyOTP,registerUser} from "../services/authApi";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";


const Register = () => {
    const navigate = useNavigate();

    const [email,setEmail]=useState("");
    const [contact,setContact] =useState("");

    const [otp,setOtp]=useState("");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] =useState(false);

    const handleSendOTP=async(e)=>{
        try{
            e.preventDefault();
            const res=await sendOTP({email,contact});
            toast.success(res.data.message);
            setOtpSent(true);
        }
        catch(error)
        {
           toast.error(error.response?.data?.message);
        }
    }
    const handleVerifyOTP = async (e) => {
    try {
        e.preventDefault();
      const res = await verifyOTP({ email, otp });
      toast.success(res.data.message);
      setOtpVerified(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    }
  };

  const handleRegister = async (e) => {
    try {
        e.preventDefault();
      const res = await registerUser({ email, username, password });
      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    }
  };

    return (
<div>
      <h1>Register</h1>
      

      {!otpSent && (
        <>
          <input 
             type="email" 
             placeholder="Email" 
             value={email} 
             onChange={(e) => setEmail(e.target.value)} />
          <input 
            type="text" 
            placeholder="Contact" 
            value={contact} 
            onChange={(e) => setContact(e.target.value)} />
          <button type="submit"   onClick={handleSendOTP}>Send OTP</button>
        </>
      )}

      {otpSent && !otpVerified && (
        <>
          <input 
          type="text" 
          placeholder="Enter OTP" 
          value={otp} 
          onChange={(e) => setOtp(e.target.value)} />
          <button type="submit" onClick={handleVerifyOTP}>Verify OTP</button>
        </>
      )}

      {otpVerified && (
        <>
          <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" onClick={handleRegister}>Register</button>
        </>
      )}
    </div>
  );
};

export default Register;