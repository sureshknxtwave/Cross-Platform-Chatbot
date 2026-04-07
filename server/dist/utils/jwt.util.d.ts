export interface JWTPayload {
    userId: string;
    email: string;
}
export declare const generateToken: (payload: JWTPayload) => string;
export declare const verifyToken: (token: string) => JWTPayload;
//# sourceMappingURL=jwt.util.d.ts.map