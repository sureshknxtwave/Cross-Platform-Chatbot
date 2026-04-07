interface CallPayload {
    phoneNumber: string;
    userName: string;
    userEmail: string;
    preferredCourse?: string;
    queryTopic?: string;
}
interface VapiCallResponse {
    id: string;
    status: string;
    [key: string]: unknown;
}
export declare const initiateOutboundCall: (payload: CallPayload) => Promise<VapiCallResponse>;
export {};
//# sourceMappingURL=vapi.service.d.ts.map