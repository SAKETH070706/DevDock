import dns from "dns";

dns.setServers([
    "8.8.8.8",
    "8.8.4.4"
]);


import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User from "../src/models/userModel.js";
import Room from "../src/models/roomModel.js";

const MONGO_URI = process.env.MONGO_URI;
const USER_ID = process.env.BENCH_USER_ID;
const ROOM_ID = process.env.BENCH_ROOM_ID;

const ITERATIONS = 200;
const WARMUP = 20;

if (!MONGO_URI) {
    console.error("❌ MONGO_URI is missing from .env");
    process.exit(1);
}

if (!USER_ID) {
    console.error("❌ BENCH_USER_ID is missing from .env");
    process.exit(1);
}

if (!ROOM_ID) {
    console.error("❌ BENCH_ROOM_ID is missing from .env");
    process.exit(1);
}

async function benchmark(name, fn) {
    // Warm-up requests so connection/query initialization
    // doesn't distort the actual measurements.
    for (let i = 0; i < WARMUP; i++) {
        await fn();
    }

    const times = [];

    for (let i = 0; i < ITERATIONS; i++) {
        const start = process.hrtime.bigint();

        await fn();

        const end = process.hrtime.bigint();

        const ms = Number(end - start) / 1_000_000;

        times.push(ms);
    }

    times.sort((a, b) => a - b);

    const sum = times.reduce((total, value) => total + value, 0);

    const average = sum / times.length;

    const percentile = (p) => {
        const index = Math.ceil(p * times.length) - 1;
        return times[Math.max(0, index)];
    };

    return {
        name,
        average,
        p50: percentile(0.50),
        p95: percentile(0.95),
        p99: percentile(0.99),
        min: times[0],
        max: times[times.length - 1]
    };
}

function printResult(result) {
    console.log(`\n${result.name}`);

    console.log("--------------------------------");
    console.log(`Average : ${result.average.toFixed(2)} ms`);
    console.log(`P50     : ${result.p50.toFixed(2)} ms`);
    console.log(`P95     : ${result.p95.toFixed(2)} ms`);
    console.log(`P99     : ${result.p99.toFixed(2)} ms`);
    console.log(`Min     : ${result.min.toFixed(2)} ms`);
    console.log(`Max     : ${result.max.toFixed(2)} ms`);
    console.log("--------------------------------");
}

try {
    console.log("\nConnecting to MongoDB...");

    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB connected");

    console.log(`\nIterations : ${ITERATIONS}`);
    console.log(`Warm-up    : ${WARMUP}`);
    console.log(`User ID    : ${USER_ID}`);
    console.log(`Room ID    : ${ROOM_ID}`);

    // --------------------------------------------------
    // TEST 1
    // Same query used inside authMiddleware
    // --------------------------------------------------

    const userResult = await benchmark(
        "1. User.findById()",
        async () => {
            await User.findById(USER_ID)
                .select("-password");
        }
    );

    printResult(userResult);

    // --------------------------------------------------
    // TEST 2
    // Basic room lookup
    // Same lookup used inside roomService.js
    // --------------------------------------------------

    const roomResult = await benchmark(
        "2. Room.findById()",
        async () => {
            await Room.findById(ROOM_ID);
        }
    );

    printResult(roomResult);

    // --------------------------------------------------
    // TEST 3
    // Room lookup + population
    // Same operation used by getRoomById()
    // --------------------------------------------------

    const populatedRoomResult = await benchmark(
        "3. Room.findById() + populate()",
        async () => {
            await Room.findById(ROOM_ID)
                .populate("host", "username email")
                .populate("participants", "username email");
        }
    );

    printResult(populatedRoomResult);

    // --------------------------------------------------
    // SUMMARY
    // --------------------------------------------------

    console.log("\n");
    console.log("========================================");
    console.log("       DEVDOCK DATABASE BASELINE");
    console.log("========================================");

    console.log(
        `User.findById()                 : ${userResult.average.toFixed(2)} ms avg`
    );

    console.log(
        `Room.findById()                 : ${roomResult.average.toFixed(2)} ms avg`
    );

    console.log(
        `Room + populate()               : ${populatedRoomResult.average.toFixed(2)} ms avg`
    );

    console.log("========================================\n");

} catch (error) {
    console.error("\n❌ Benchmark failed:");
    console.error(error);
} finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
}