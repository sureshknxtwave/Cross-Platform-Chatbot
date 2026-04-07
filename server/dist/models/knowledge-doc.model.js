// Mongoose reference for knowledge_docs collection.
// Actual data inserted by LangChain via native MongoDB driver.
import mongoose, { Schema } from "mongoose";
const KnowledgeDocSchema = new Schema({
    text: { type: String, required: true },
    embedding: { type: [Number], default: [] },
    metadata: { type: Schema.Types.Mixed, default: {} },
});
export default mongoose.model("KnowledgeDoc", KnowledgeDocSchema, "knowledge_docs");
//# sourceMappingURL=knowledge-doc.model.js.map