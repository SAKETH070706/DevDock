export const authMiddleware=async(req,res,next)=>
{
    const _t0 = process.hrtime.bigint();
    try{
        const authHeader=req.headers.authorization;
        if(!authHeader || !authHeader.startsWith("Bearer"))
        {
             return res.status(401).json({ success: false, message: "Access denied" });
        }
       const token=authHeader.split(" ")[1];
       const decoded=jwt.verify(token,process.env.JWT_SECRET);
       const _tUser0 = process.hrtime.bigint();
       const user=await User.findById(decoded.id).select("-password");
       const _tUser1 = process.hrtime.bigint();
       console.log(`[BENCH] User.findById: ${Number(_tUser1 - _tUser0) / 1e6} ms`);
       if(!user)
       {
         return res.status(401).json({ success: false, message: "User not found" });
       }
       req.user=user;
       req._benchStart = _t0; // pass start time downstream
       next();
    }
    catch(error)
    {
            return res.status(401).json({ success: false, message: "Invalid token" });
    }
};