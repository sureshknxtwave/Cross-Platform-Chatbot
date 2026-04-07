// ============================================
// FILE: src/app.ts
// PURPOSE: Configure Express — middleware, routes, error handling
// ============================================
// ============================================
// FILE: src/app.ts
// PURPOSE: Configure Express — middleware, routes, error handling
// ============================================
import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.routes.js";
import authRoutes from "./routes/auth.routes.js";
import vapiRoutes from "./routes/vapi.routes.js";
import errorHandler from "./middleware/error-handler.middleware.js";
const app = express();
// Middleware
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            process.env.CLIENT_URL,
            "http://localhost:5173",
            "http://localhost:5174",
        ].filter(Boolean);
        // Allow same-origin/server-to-server requests (no Origin header)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/vapi", vapiRoutes);
// 404
app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found." });
});
// Global error handler (must be last)
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map