import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
const withTimeout = async (promise, ms, label) => {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms)),
    ]);
};
const getHealthcareResponse = async (question) => {
    const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.5-flash",
        temperature: 0.4,
    });
    const prompt = `
You are a healthcare assistant chatbot for general informational support only.
Rules:
- Keep answers practical and easy to follow.
- Do not provide a diagnosis.
- If severe symptoms are mentioned (chest pain, breathing difficulty, heavy bleeding, unconsciousness), advise emergency care immediately.
- Also treat these as emergency red flags: stroke signs (face droop, slurred speech, one-side weakness), seizure, suicidal thoughts, very high fever in child, severe allergic reaction, persistent vomiting with dehydration.
- If user asks to book appointment, provide a short checklist: preferred date/time, symptom summary, contact number.
- If medicine is discussed, avoid dosage for prescription-only drugs and suggest consulting a clinician.
- Ask one clarifying question when age, pregnancy status, chronic illness, or allergies could change advice.
- Add this short disclaimer at the end: "This is general guidance, not medical diagnosis."

User question: ${question}
`;
    const response = await withTimeout(model.invoke(prompt), 18000, "Healthcare LLM");
    return typeof response.content === "string"
        ? response.content
        : JSON.stringify(response.content);
};
export const getRAGResponse = async (question) => {
    try {
        return await getHealthcareResponse(question);
    }
    catch (error) {
        console.error("❌ RAG ERROR:", error);
        return "I am facing a delay right now. Please try again in a few seconds.";
    }
};
//# sourceMappingURL=rag.service.js.map