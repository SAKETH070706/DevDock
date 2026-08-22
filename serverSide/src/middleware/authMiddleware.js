import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authMiddleware = async (req, res, next) => {

    const _t0 = process.hrtime.bigint();

    try {

        console.log("\n========== AUTH DEBUG ==========");

        const authHeader = req.headers.authorization;

        console.log("[AUTH] Authorization header exists:",
            !!authHeader
        );

        console.log("[AUTH] Authorization starts with Bearer:",
            authHeader?.startsWith("Bearer")
        );

        if (!authHeader || !authHeader.startsWith("Bearer")) {

            console.log("[AUTH] ❌ Missing/invalid Authorization header");

            return res.status(401).json({
                success: false,
                message: "Access denied"
            });
        }

        const token = authHeader.split(" ")[1];

        console.log("[AUTH] Token received:", !!token);
        console.log("[AUTH] Token length:", token?.length);

        // DO NOT PRINT JWT_SECRET OR THE FULL TOKEN

        console.log("[AUTH] JWT_SECRET exists:",
            !!process.env.JWT_SECRET
        );

        console.log("[AUTH] JWT_SECRET length:",
            process.env.JWT_SECRET?.length
        );

        console.log("[AUTH] Verifying JWT...");

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("[AUTH] ✅ JWT verified");
        console.log("[AUTH] Decoded ID:", decoded.id);
        console.log("[AUTH] Issued At:", decoded.iat);
        console.log("[AUTH] Expires At:", decoded.exp);

        const _tUser0 = process.hrtime.bigint();

        console.log("[AUTH] Finding user...");

        const user = await User.findById(decoded.id)
            .select("-password");

        const _tUser1 = process.hrtime.bigint();

        console.log(
            `[BENCH] User.findById: ${Number(_tUser1 - _tUser0) / 1e6} ms`
        );

        if (!user) {

            console.log("[AUTH] ❌ User not found");

            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        console.log("[AUTH] ✅ User found:", user.username);

        req.user = user;

        req._benchStart = _t0;

        console.log("[AUTH] ✅ Authentication successful");
        console.log("================================\n");

        next();

    } catch (error) {

        console.log("\n========== AUTH ERROR ==========");

        console.log("[AUTH] Error name:", error.name);
        console.log("[AUTH] Error message:", error.message);

        console.log("[AUTH] Error stack:", error.stack);

        console.log("================================\n");

        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};