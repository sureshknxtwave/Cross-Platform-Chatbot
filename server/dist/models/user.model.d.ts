import mongoose from "mongoose";
import type { Document } from "mongoose";
export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    phone?: string;
    created_at: Date;
}
declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
export default User;
//# sourceMappingURL=user.model.d.ts.map