import type { Request, Response, NextFunction } from "express";
interface AppError extends Error {
    statusCode?: number;
    code?: number;
    keyPattern?: Record<string, number>;
}
declare const errorHandler: (err: AppError, req: Request, res: Response, _next: NextFunction) => void;
export default errorHandler;
//# sourceMappingURL=error-handler.middleware.d.ts.map