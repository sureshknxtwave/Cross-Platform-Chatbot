import type { Request, Response, NextFunction } from "express";
export declare const sendMessage: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createAppointment: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAppointmentInsights: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const listAppointments: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createMedicationReminder: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const listMedicationReminders: (_req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=chat.controller.d.ts.map