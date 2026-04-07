import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const withTimeout = async <T>(
  promise: Promise<T>,
  ms: number,
  label: string,
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timeout after ${ms}ms`)), ms),
    ),
  ]);
};

const getSymptomFallbackResponse = (question: string): string => {
  const q = question.toLowerCase();

  if (q.includes("fever") && q.includes("headache")) {
    return [
      "For fever with headache, you can try these steps:",
      "1) Rest and drink plenty of fluids.",
      "2) Use a light diet and avoid dehydration.",
      "3) You may use an over-the-counter fever/pain medicine as per label instructions.",
      "4) Monitor temperature and symptoms for the next 24 hours.",
      "Seek urgent care now if you have severe neck stiffness, confusion, breathing trouble, persistent vomiting, seizure, or very high fever.",
      "This is general guidance, not medical diagnosis.",
    ].join("\n");
  }

  if (q.includes("dehydration")) {
    return [
      "Common dehydration signs include dry mouth, dark urine, dizziness, weakness, and low urine output.",
      "Start oral fluids (water/ORS) in small frequent sips.",
      "Seek urgent care for persistent vomiting, confusion, fainting, or inability to keep fluids down.",
      "This is general guidance, not medical diagnosis.",
    ].join("\n");
  }

  if (q.includes("cold") || q.includes("cough")) {
    return [
      "For mild cold/cough: rest, warm fluids, steam inhalation, and hydration can help.",
      "If symptoms worsen, last beyond a few days, or include breathing difficulty/high fever, consult a doctor.",
      "This is general guidance, not medical diagnosis.",
    ].join("\n");
  }

  return "I am facing a delay right now. Please try again in a few seconds.";
};

const getHealthcareResponse = async (question: string): Promise<string> => {
  const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
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

export const getRAGResponse = async (question: string): Promise<string> => {
  try {
    return await getHealthcareResponse(question);
  } catch (error) {
    console.error("❌ RAG ERROR:", error);
    return getSymptomFallbackResponse(question);
  }
};