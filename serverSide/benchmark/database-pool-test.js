import dns from "dns";
dns.setServers([
    "8.8.4.4"
]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/userModel.js";
import Room from "../src/models/roomModel.js";

dotenv.config();

const ROOM_ID = "6a89c06dccdee083aacc6c6b";

const CONCURRENCY = 50;
const ITERATIONS = 200;
const WARMUP = 20;

const POOL_SIZES = [5, 10, 25, 50, 100];


async function runBenchmark(poolSize) {

    console.log("\n========================================");
    console.log(`POOL SIZE: ${poolSize}`);
    console.log("========================================");

    await mongoose.connect(process.env.MONGO_URI, {
        maxPoolSize: poolSize,
        minPoolSize: 0
    });

    console.log("✅ MongoDB connected");


    // -----------------------------
    // Warm-up
    // -----------------------------

    await Promise.all(
        Array.from(
            { length: WARMUP },
            () =>
                Room.findById(ROOM_ID)
                    .populate("host", "username email")
                    .populate("participants", "username email")
                    .lean()
        )
    );


    const times = [];

    const start = Date.now();


    // -----------------------------
    // Concurrent requests
    // -----------------------------

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


                    await Room.findById(ROOM_ID)
                        .populate("host", "username email")
                        .populate("participants", "username email")
                        .lean();


                    const t1 = process.hrtime.bigint();


                    return Number(t1 - t0) / 1e6;
                }
            )
        );


        times.push(...results);
    }


    const duration = Date.now() - start;


    times.sort((a, b) => a - b);


    const average =
        times.reduce((sum, value) => sum + value, 0) /
        times.length;


    const percentile = (p) => {

        const index =
            Math.ceil((p / 100) * times.length) - 1;

        return times[Math.max(0, index)];
    };


    console.log("--------------------------------");
    console.log(`Average : ${average.toFixed(2)} ms`);
    console.log(`P50     : ${percentile(50).toFixed(2)} ms`);
    console.log(`P95     : ${percentile(95).toFixed(2)} ms`);
    console.log(`P99     : ${percentile(99).toFixed(2)} ms`);
    console.log(`Min     : ${times[0].toFixed(2)} ms`);
    console.log(
        `Max     : ${times[times.length - 1].toFixed(2)} ms`
    );
    console.log(`Duration: ${duration} ms`);


    await mongoose.disconnect();

    console.log("MongoDB disconnected.");
}


async function main() {

    console.log("========================================");
    console.log("     DEVDOCK MONGODB POOL TEST");
    console.log("========================================");

    console.log(`Concurrency : ${CONCURRENCY}`);
    console.log(`Iterations  : ${ITERATIONS}`);
    console.log(`Warm-up     : ${WARMUP}`);


    for (const poolSize of POOL_SIZES) {

        try {

            await runBenchmark(poolSize);

        } catch (error) {

            console.error(
                `❌ Pool ${poolSize} failed:`,
                error.message
            );

            try {
                await mongoose.disconnect();
            } catch {}
        }
    }


    console.log("\n========================================");
    console.log("             TEST COMPLETE");
    console.log("========================================");
}


main();