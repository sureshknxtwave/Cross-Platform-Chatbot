import mongoose from "mongoose";
import type { Document } from "mongoose";
export interface IKnowledgeDoc extends Document {
    text: string;
    embedding: number[];
    metadata: Record<string, unknown>;
}
declare const _default: mongoose.Model<IKnowledgeDoc, {}, {}, {}, mongoose.Document<unknown, {}, IKnowledgeDoc, {}, mongoose.DefaultSchemaOptions> & IKnowledgeDoc & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IKnowledgeDoc>;
export default _default;
//# sourceMappingURL=knowledge-doc.model.d.ts.map