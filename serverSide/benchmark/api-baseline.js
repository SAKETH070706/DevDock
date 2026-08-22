import autocannon from "autocannon";
import dotenv from "dotenv";
dotenv.config();
const URL = process.env.DEVDOCK_URL;
const TOKEN = process.env.DEVDOCK_TOKEN;
const ROOM_ID = process.env.DEVDOCK_ROOM_ID;

if (!URL || !TOKEN || !ROOM_ID) {
    console.error("Missing benchmark environment variables.");
    process.exit(1);
}

const instance = autocannon({
    url: `${URL}/api/rooms/${ROOM_ID}`,
    connections: 50,
    duration: 30,
    headers: {
        Authorization: `Bearer ${TOKEN}`
    }
});

autocannon.track(instance);

instance.on("done", (result) => {
    console.log("\n========== DEVDOCK BASELINE ==========");
    console.log(`Average latency : ${result.latency.average} ms`);
    console.log(`P50 latency     : ${result.latency.p50} ms`);
    console.log(`P99 latency     : ${result.latency.p99} ms`);
    console.log(`Requests/sec    : ${result.requests.average}`);
    console.log(`Total requests  : ${result.requests.total}`);
    console.log(`Duration        : ${result.duration}s`);
    console.log("======================================\n");
});