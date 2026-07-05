import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {forgotPassword} from "../services/authApi";
import toast from "react-hot-toast";

const ForgotPassword=()=>{
    const navigate=useNavigate();

    const [email,setEmail]=useState("");
    const [loading,setLoading]=useState(false);

    const handleSubmit=async(e)=>{
        e.preventDefault();

        try{
            setLoading(true);
            await forgotPassword({email});
            toast.success("OTP sent successfully");
            navigate("/reset-password",{state:{email}});
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Forgot Password</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Sending OTP..." : "Send OTP"}
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;