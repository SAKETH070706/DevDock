import autocannon from "autocannon";

const URL =
  "https://devdock07.onrender.com/api/rooms/6a89e22418e04cb2acd9f966";

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNmYwNGZhMTFkMGY4YmEyYTY2MGFmZSIsImlhdCI6MTc4NzQyMDkwMCwiZXhwIjoxNzkwMDEyOTAwfQ.06IR_apHIwOTYkMQRVKTmxDzj-DSWqu1tA-ob6lkGAU";

const CONNECTIONS = 50;
const REQUESTS = 200;

console.log("========================================");
console.log("      DEVDOCK REDIS API BENCHMARK");
console.log("========================================");
console.log(`URL         : ${URL}`);
console.log(`Concurrency : ${CONNECTIONS}`);
console.log(`Requests    : ${REQUESTS}`);
console.log("========================================");

const result = await autocannon({
    url: URL,
    connections: CONNECTIONS,
    amount: REQUESTS,
    headers: {
        Authorization: `Bearer ${TOKEN}`,
    },
    method: "GET",
});

console.log("\n========================================");
console.log("        RESULTS");
console.log("========================================");

console.log(`Requests/sec : ${result.requests.average}`);
console.log(`Latency avg  : ${result.latency.average} ms`);
console.log(`P50          : ${result.latency.p50} ms`);
console.log(`P95          : ${result.latency.p95} ms`);
console.log(`P99          : ${result.latency.p99} ms`);
console.log(`Min          : ${result.latency.min} ms`);
console.log(`Max          : ${result.latency.max} ms`);
console.log(`Duration     : ${result.duration} sec`);
console.log(`Total errors : ${result.errors}`);

console.log("========================================");
