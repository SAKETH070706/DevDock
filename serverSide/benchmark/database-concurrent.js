import dns from "dns";
dns.setServers([
    "8.8.4.4"
]);

import mongoose from "mongoose";
import User from "../src/models/userModel.js";
import Room from "../src/models/roomModel.js";
import dotenv from "dotenv";

dotenv.config();

const USER_ID = "6a6f04fa11d0f8ba2a660afe";
const ROOM_ID = "6a89c06dccdee083aacc6c6b";

const CONCURRENCY = 50;
const ITERATIONS = 200;

const results = [];

function percentile(values, p) {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
}

async function measure(name, fn) {

    const times = [];

    console.log(`\n${name}`);
    console.log("--------------------------------");

    let completed = 0;

    async function worker() {

        while (true) {

            const current = completed++;

            if (current >= ITERATIONS) {
                return;
            }

            const start = process.hrtime.bigint();

            await fn();

            const end = process.hrtime.bigint();

            const ms =
                Number(end - start) / 1e6;

            times.push(ms);
        }
    }

    const startAll = Date.now();

    await Promise.all(
        Array.from(
            { length: CONCURRENCY },
            () => worker()
        )
    );

    const duration = Date.now() - startAll;

    const average =
        times.reduce((a, b) => a + b, 0) /
        times.length;

    console.log(
        `Average : ${average.toFixed(2)} ms`
    );

    console.log(
        `P50     : ${percentile(times, 50).toFixed(2)} ms`
    );

    console.log(
        `P95     : ${percentile(times, 95).toFixed(2)} ms`
    );

    console.log(
        `P99     : ${percentile(times, 99).toFixed(2)} ms`
    );

    console.log(
        `Min     : ${Math.min(...times).toFixed(2)} ms`
    );

    console.log(
        `Max     : ${Math.max(...times).toFixed(2)} ms`
    );

    console.log(
        `Duration: ${duration} ms`
    );

    results.push({
        name,
        average,
        p50: percentile(times, 50),
        p95: percentile(times, 95),
        p99: percentile(times, 99),
        min: Math.min(...times),
        max: Math.max(...times)
    });
}

async function main() {

    try {

        console.log("Connecting to MongoDB...");

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log("✅ MongoDB connected");

        console.log(
            `Concurrency : ${CONCURRENCY}`
        );

        console.log(
            `Iterations  : ${ITERATIONS}`
        );

        await measure(
            "1. User.findById()",
            async () => {
                await User
                    .findById(USER_ID)
                    .select("-password")
                    .lean();
            }
        );

        await measure(
            "2. Room.findById()",
            async () => {
                await Room.findById(ROOM_ID);
            }
        );

        await measure(
            "3. Room.findById() + populate()",
            async () => {

                await Room
                    .findById(ROOM_ID)
                    .populate(
                        "host",
                        "username email"
                    )
                    .populate(
                        "participants",
                        "username email"
                    );
            }
        );

        console.log(
            "\n========================================"
        );

        console.log(
            "       DEVDOCK CONCURRENT DB BASELINE"
        );

        console.log(
            "========================================"
        );

        for (const r of results) {

            console.log(
                `${r.name} : ${r.average.toFixed(2)} ms avg`
            );

        }

        console.log(
            "========================================"
        );

    }
    catch (error) {

        console.error(
            "\n❌ Benchmark failed:"
        );

        console.error(error);

    }
    finally {

        await mongoose.disconnect();

        console.log(
            "\nMongoDB disconnected."
        );

    }
}

main();