import app from "./app.js";
import connectDB from "./config/database.config.js";
const PORT = process.env.PORT || 5000;
import dotenv from "dotenv";
dotenv.config();
const start = async () => {
    try {
        // 1. Connect Mongoose
        await connectDB();
        // 2. Start Express
        app.listen(PORT, () => {
            console.log(` EduReach Server is running!`);
            console.log(` URL: http://localhost:${PORT}`);
            console.log(` Node: ${process.version}`);
            console.log(` Press Ctrl+C to stop`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=server.js.map