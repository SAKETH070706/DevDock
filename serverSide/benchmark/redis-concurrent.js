import redis from "../src/config/redis.js";

const concurrency = 50;
const iterations = 200;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
    console.log("========================================");
    console.log("       DEVDOCK REDIS CONCURRENT TEST");
    console.log("========================================");
    console.log(`Concurrency : ${concurrency}`);
    console.log(`Iterations  : ${iterations}`);
    console.log("========================================");

    await redis.set("benchmark:test", "hello");

    // Warm-up
    for (let i = 0; i < 20; i++) {
        await redis.get("benchmark:test");
    }

    const times = [];

    let completed = 0;

    const worker = async () => {
        while (true) {
            const current = completed++;

            if (current >= iterations) {
                return;
            }

            const start = process.hrtime.bigint();

            await redis.get("benchmark:test");

            const end = process.hrtime.bigint();

            times.push(Number(end - start) / 1e6);
        }
    };

    const startTime = Date.now();

    await Promise.all(
        Array.from(
            { length: concurrency },
            () => worker()
        )
    );

    const duration = Date.now() - startTime;

    times.sort((a, b) => a - b);

    const average =
        times.reduce((sum, value) => sum + value, 0) / times.length;

    const percentile = (p) => {
        const index = Math.ceil((p / 100) * times.length) - 1;
        return times[Math.max(0, index)];
    };

    console.log("----------------------------------------");
    console.log(`Average : ${average.toFixed(2)} ms`);
    console.log(`P50     : ${percentile(50).toFixed(2)} ms`);
    console.log(`P95     : ${percentile(95).toFixed(2)} ms`);
    console.log(`P99     : ${percentile(99).toFixed(2)} ms`);
    console.log(`Min     : ${times[0].toFixed(2)} ms`);
    console.log(`Max     : ${times[times.length - 1].toFixed(2)} ms`);
    console.log(`Duration: ${duration} ms`);
    console.log("----------------------------------------");

    await redis.del("benchmark:test");

    await redis.quit();

    console.log("Redis disconnected.");
}

run().catch(async (error) => {
    console.error("Redis benchmark failed:", error);

    try {
        await redis.quit();
    } catch {}

    process.exit(1);
});