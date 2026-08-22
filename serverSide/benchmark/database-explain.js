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

async function main() {

    try {

        console.log("Connecting to MongoDB...");

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ MongoDB connected");


        // ==========================================
        // USER QUERY
        // ==========================================

        console.log("\n========================================");
        console.log("USER FIND BY ID");
        console.log("========================================");

        const userExplain =
            await User.findById(USER_ID)
                .select("-password")
                .explain("executionStats");

        console.log(
            JSON.stringify(
                userExplain,
                null,
                2
            )
        );


        // ==========================================
        // ROOM QUERY
        // ==========================================

        console.log("\n========================================");
        console.log("ROOM FIND BY ID");
        console.log("========================================");

        const roomExplain =
            await Room.findById(ROOM_ID)
                .explain("executionStats");

        console.log(
            JSON.stringify(
                roomExplain,
                null,
                2
            )
        );


        // ==========================================
        // USERNAME / EMAIL INDEX INFORMATION
        // ==========================================

        console.log("\n========================================");
        console.log("USER INDEXES");
        console.log("========================================");

        console.log(
            await User.collection.indexes()
        );


        // ==========================================
        // ROOM INDEX INFORMATION
        // ==========================================

        console.log("\n========================================");
        console.log("ROOM INDEXES");
        console.log("========================================");

        console.log(
            await Room.collection.indexes()
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