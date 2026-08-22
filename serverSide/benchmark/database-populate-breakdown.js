import dns from "dns";
dns.setServers([
    "8.8.4.4"
]);

import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../src/models/userModel.js";
import Room from "../src/models/roomModel.js";

dotenv.config();

const USER_ID = "6a6f04fa11d0f8ba2a660afe";
const ROOM_ID = "6a89c06dccdee083aacc6c6b";

const CONCURRENCY = 50;
const ITERATIONS = 200;
const WARMUP = 20;

async function measure(name, queryFn) {
    console.log(`\n${name}`);
    console.log("--------------------------------");

    // Warm-up
    await Promise.all(
        Array.from({ length: WARMUP }, () => queryFn())
    );

    const times = [];

    const start = Date.now();

    for (let i = 0; i < ITERATIONS; i += CONCURRENCY) {
        const batchSize = Math.min(
            CONCURRENCY,
            ITERATIONS - i
        );

        const results = await Promise.all(
            Array.from(
                { length: batchSize },
                async () => {
                    const t0 = process.hrtime.bigint();

                    await queryFn();

                    const t1 = process.hrtime.bigint();

                    return Number(t1 - t0) / 1e6;
                }
            )
        );

        times.push(...results);
    }

    const duration = Date.now() - start;

    times.sort((a, b) => a - b);

    const avg =
        times.reduce((sum, value) => sum + value, 0) /
        times.length;

    const percentile = (p) => {
        const index = Math.ceil((p / 100) * times.length) - 1;
        return times[Math.max(0, index)];
    };

    console.log(`Average : ${avg.toFixed(2)} ms`);
    console.log(`P50     : ${percentile(50).toFixed(2)} ms`);
    console.log(`P95     : ${percentile(95).toFixed(2)} ms`);
    console.log(`P99     : ${percentile(99).toFixed(2)} ms`);
    console.log(`Min     : ${times[0].toFixed(2)} ms`);
    console.log(`Max     : ${times[times.length - 1].toFixed(2)} ms`);
    console.log(`Duration: ${duration} ms`);
}

async function main() {
    try {
        console.log("Connecting to MongoDB...");

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB connected");

        console.log(`Concurrency : ${CONCURRENCY}`);
        console.log(`Iterations  : ${ITERATIONS}`);
        console.log(`Warm-up     : ${WARMUP}`);

        // ------------------------------------------------
        // 1. Room only
        // ------------------------------------------------

        await measure(
            "1. Room.findById()",
            async () => {
                await Room.findById(ROOM_ID).lean();
            }
        );

        // ------------------------------------------------
        // 2. Room + host populate
        // ------------------------------------------------

        await measure(
            "2. Room.findById() + host populate()",
            async () => {
                await Room.findById(ROOM_ID)
                    .populate("host", "username email")
                    .lean();
            }
        );

        // ------------------------------------------------
        // 3. Room + participants populate
        // ------------------------------------------------

        await measure(
            "3. Room.findById() + participants populate()",
            async () => {
                await Room.findById(ROOM_ID)
                    .populate("participants", "username email")
                    .lean();
            }
        );

        // ------------------------------------------------
        // 4. Room + both populates
        // ------------------------------------------------

        await measure(
            "4. Room.findById() + host + participants populate()",
            async () => {
                await Room.findById(ROOM_ID)
                    .populate("host", "username email")
                    .populate("participants", "username email")
                    .lean();
            }
        );

        console.log("\n========================================");
        console.log("     DEVDOCK POPULATE BREAKDOWN");
        console.log("========================================");

        console.log("Host vs Participants vs Both");
        console.log("========================================");

    } catch (error) {
        console.error("\n❌ Benchmark failed:");
        console.error(error);
    } finally {
        await mongoose.disconnect();
        console.log("\nMongoDB disconnected.");
    }
}

main();