import type { Request, Response, NextFunction } from "express";
import type { JWTPayload } from "../utils/jwt.util.ts";
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}
declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export default authMiddleware;
//# sourceMappingURL=auth.middleware.d.ts.map