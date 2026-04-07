// ============================================
// PURPOSE: Global error handler — catches all unhandled errors
// ============================================
const errorHandler = (err, req, res, _next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    // MongoDB duplicate key error
    if (err.code === 11000) {
        statusCode = 409;
        const field = err.keyPattern ? Object.keys(err.keyPattern)[0] : "field";
        message = `A user with this ${field} already exists.`;
    }
    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
    }
    if (process.env.NODE_ENV === "development") {
        console.error("Error:", err.message);
    }
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};
export default errorHandler;
