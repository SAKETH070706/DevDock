export const authMiddleware = async (req, res, next) =>
{
    console.log("🔥🔥🔥 AUTH MIDDLEWARE HIT 🔥🔥🔥");

    const _t0 = process.hrtime.bigint();
    console.log("[AUTH TEST] Middleware reached");

    try {
        const authHeader = req.headers.authorization;

        console.log(
            "[AUTH TEST] Authorization header exists:",
            !!authHeader
        );

        if (!authHeader || !authHeader.startsWith("Bearer"))
        {
            console.log("[AUTH TEST] Header missing/invalid");

            return res.status(401).json({
                success: false,
                message: "Access denied"
            });
        }

        const token = authHeader.split(" ")[1];

        console.log(
            "[AUTH TEST] Token received:",
            !!token,
            "length:",
            token?.length
        );

        console.log(
            "[AUTH TEST] JWT_SECRET exists:",
            !!process.env.JWT_SECRET,
            "length:",
            process.env.JWT_SECRET?.length
        );

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log(
            "[AUTH TEST] JWT VERIFIED:",
            decoded.id
        );

        const _tUser0 = process.hrtime.bigint();

        const user = await User.findById(decoded.id)
            .select("-password");

        const _tUser1 = process.hrtime.bigint();

        console.log(
            `[BENCH] User.findById: ${Number(_tUser1 - _tUser0) / 1e6} ms`
        );

        if (!user)
        {
            console.log("[AUTH TEST] User not found");

            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;

        next();
    }
    catch(error)
    {
        console.error(
            "[AUTH TEST] JWT ERROR:",
            error.name,
            error.message
        );

        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};