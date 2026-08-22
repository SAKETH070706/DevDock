import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import redis from "../config/redis.js";

const USER_CACHE_EXPIRY = 5 * 60;

export const authMiddleware = async (req, res, next) => {
    const _t0 = process.hrtime.bigint();

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                success: false,
                message: "Access denied"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const cacheKey = `user:${decoded.id}`;

        const _tUser0 = process.hrtime.bigint();

        let user;

        // =========================
        // CHECK REDIS CACHE
        // =========================

        const cachedUser = await redis.get(cacheKey);

        if (cachedUser) {

            user = JSON.parse(cachedUser);

            const _tUser1 = process.hrtime.bigint();

            console.log(
                `[CACHE] USER HIT: ${Number(_tUser1 - _tUser0) / 1e6} ms`
            );

        } else {

            // =========================
            // CACHE MISS → MONGODB
            // =========================

            user = await User.findById(decoded.id)
                .select("-password");

            const _tUser1 = process.hrtime.bigint();

            console.log(
                `[CACHE] USER MISS: ${Number(_tUser1 - _tUser0) / 1e6} ms`
            );

            if (user) {
                await redis.setex(
                    cacheKey,
                    USER_CACHE_EXPIRY,
                    JSON.stringify(user)
                );

                console.log("[CACHE] USER STORED");
            }
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        req.user = user;

        req._benchStart = _t0;

        next();

    } catch (error) {

        console.error("[AUTH ERROR]", error.message);

        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};