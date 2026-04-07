import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Minus, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { SpeechRecognition } from "@capacitor-community/speech-recognition";
import { useAuth } from "../context/AuthContext";
import {
  createAppointment,
  createMedicationReminder,
  sendMessage,
} from "../services/chat.service";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
}

type AppointmentStep = "name" | "date" | "time" | "symptoms" | "contact" | null;
type ReminderStep =
  | "patientName"
  | "medicineName"
  | "dosage"
  | "frequency"
  | "startDate"
  | "endDate"
  | "contact"
  | null;

const quickQuestions = [
  "I have fever and headache. What should I do?",
  "Book an appointment for tomorrow evening",
  "Set medicine reminder for Paracetamol",
  "What are common signs of dehydration?",
  "How can I manage mild cold at home?",
];
const appointmentIntentPattern = /\b(appointment|book|schedule|doctor visit|consultation)\b/i;
const contactPattern = /^[0-9+\-\s()]{8,20}$/;
const reminderIntentPattern = /\b(medicine|medication|tablet|reminder|dose)\b/i;

export default function ChatDrawer({ open, onClose }: ChatDrawerProps) {
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hi ${
        user?.name?.split(" ")[0] || "there"
      }! 👋 I'm Health Assistant Bot. I can help with symptoms, basic care tips, and appointment guidance.`,
      sender: "bot",
    },
  ]);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(true);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");
  const [speechRate, setSpeechRate] = useState(1);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [appointmentStep, setAppointmentStep] = useState<AppointmentStep>(null);
  const [reminderStep, setReminderStep] = useState<ReminderStep>(null);
  const [appointmentData, setAppointmentData] = useState({
    name: "",
    date: "",
    time: "",
    symptoms: "",
    contact: "",
  });
  const [reminderData, setReminderData] = useState({
    patientName: "",
    medicineName: "",
    dosage: "",
    frequency: "",
    startDate: "",
    endDate: "",
    contact: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const isNativeMobile = Capacitor.isNativePlatform();

  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isNativeMobile) {
      const setupNativeSpeech = async () => {
        try {
          const available = await SpeechRecognition.available();
          if (!available.available) {
            setSpeechSupported(false);
            return;
          }

          const permission = await SpeechRecognition.checkPermissions();
          if (permission.speechRecognition !== "granted") {
            const requested = await SpeechRecognition.requestPermissions();
            if (requested.speechRecognition !== "granted") {
              setSpeechSupported(false);
              addBotMessage("Microphone permission is required for voice input.");
              return;
            }
          }

          await SpeechRecognition.addListener("partialResults", (data: { matches: string[] }) => {
            setInput((data.matches?.[0] || "").trim());
          });

          await SpeechRecognition.addListener("listeningState", (data: { status: "started" | "stopped" }) => {
            setIsListening(data.status === "started");
          });

          setSpeechSupported(true);
        } catch {
          setSpeechSupported(false);
        }
      };

      setupNativeSpeech();

      return () => {
        SpeechRecognition.removeAllListeners();
      };
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript.trim());
    };

    recognition.onerror = () => {
      addBotMessage("Voice input failed. Please type your message.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    setSpeechSupported(true);
  }, [isNativeMobile]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      if (!selectedVoiceURI && voices.length > 0) {
        setSelectedVoiceURI(voices[0].voiceURI);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [selectedVoiceURI]);

  const addBotMessage = (text: string) => {
    if (voiceOutputEnabled && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = speechRate;
      const selectedVoice = availableVoices.find(
        (voice) => voice.voiceURI === selectedVoiceURI,
      );
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      window.speechSynthesis.speak(utterance);
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.floor(Math.random() * 1000),
        text,
        sender: "bot",
      },
    ]);
  };

  const startAppointmentFlow = () => {
    setReminderStep(null);
    setAppointmentStep("name");
    setAppointmentData({ name: "", date: "", time: "", symptoms: "", contact: "" });
    addBotMessage("Sure — I can help you book an appointment. Please share your full name.");
  };

  const startReminderFlow = () => {
    setAppointmentStep(null);
    setReminderStep("patientName");
    setReminderData({
      patientName: "",
      medicineName: "",
      dosage: "",
      frequency: "",
      startDate: "",
      endDate: "",
      contact: "",
    });
    addBotMessage("Sure — I can set a medication reminder. Please share patient full name.");
  };

  const handleAppointmentFlow = async (messageText: string): Promise<boolean> => {
    if (!appointmentStep) return false;

    const value = messageText.trim();

    if (appointmentStep === "name") {
      if (value.length < 2) {
        addBotMessage("Please enter a valid full name (at least 2 characters).");
        return true;
      }
      setAppointmentData((prev) => ({ ...prev, name: value }));
      setAppointmentStep("date");
      addBotMessage("Got it. What date do you prefer? (Example: 10 Apr 2026)");
      return true;
    }

    if (appointmentStep === "date") {
      if (value.length < 3) {
        addBotMessage("Please enter a valid preferred date.");
        return true;
      }
      setAppointmentData((prev) => ({ ...prev, date: value }));
      setAppointmentStep("time");
      addBotMessage("Thanks. What time works for you? (Example: 5:30 PM)");
      return true;
    }

    if (appointmentStep === "time") {
      if (value.length < 2) {
        addBotMessage("Please enter a valid preferred time.");
        return true;
      }
      setAppointmentData((prev) => ({ ...prev, time: value }));
      setAppointmentStep("symptoms");
      addBotMessage("Please share your main symptoms in one line.");
      return true;
    }

    if (appointmentStep === "symptoms") {
      if (value.length < 5) {
        addBotMessage("Please provide a bit more symptom detail.");
        return true;
      }
      setAppointmentData((prev) => ({ ...prev, symptoms: value }));
      setAppointmentStep("contact");
      addBotMessage("Almost done. Please provide your contact number.");
      return true;
    }

    if (!contactPattern.test(value)) {
      addBotMessage("Please enter a valid contact number (8-20 digits/characters).");
      return true;
    }

    const finalData = { ...appointmentData, contact: value };
    setSending(true);
    try {
      const saved = await createAppointment({
        ...finalData,
      });

      setAppointmentData(finalData);
      setAppointmentStep(null);
      addBotMessage(
        `Appointment request submitted successfully.\nReference ID: ${saved?.id || "N/A"}\n\nName: ${finalData.name}\nDate: ${finalData.date}\nTime: ${finalData.time}\nSymptoms: ${finalData.symptoms}\nContact: ${finalData.contact}\n\nOur team will reach out shortly to confirm your slot.`,
      );
    } catch (error) {
      addBotMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit appointment request. Please try again.",
      );
    } finally {
      setSending(false);
    }

    return true;
  };

  const handleReminderFlow = async (messageText: string): Promise<boolean> => {
    if (!reminderStep) return false;
    const value = messageText.trim();

    if (reminderStep === "patientName") {
      if (value.length < 2) {
        addBotMessage("Please enter a valid patient name.");
        return true;
      }
      setReminderData((prev) => ({ ...prev, patientName: value }));
      setReminderStep("medicineName");
      addBotMessage("Enter medicine name.");
      return true;
    }

    if (reminderStep === "medicineName") {
      setReminderData((prev) => ({ ...prev, medicineName: value }));
      setReminderStep("dosage");
      addBotMessage("Enter dosage (Example: 1 tablet).");
      return true;
    }

    if (reminderStep === "dosage") {
      setReminderData((prev) => ({ ...prev, dosage: value }));
      setReminderStep("frequency");
      addBotMessage("How often per day? (Example: 2 times/day)");
      return true;
    }

    if (reminderStep === "frequency") {
      setReminderData((prev) => ({ ...prev, frequency: value }));
      setReminderStep("startDate");
      addBotMessage("Reminder start date? (Example: 10 Apr 2026)");
      return true;
    }

    if (reminderStep === "startDate") {
      setReminderData((prev) => ({ ...prev, startDate: value }));
      setReminderStep("endDate");
      addBotMessage("End date (or type 'skip')?");
      return true;
    }

    if (reminderStep === "endDate") {
      setReminderData((prev) => ({ ...prev, endDate: value.toLowerCase() === "skip" ? "" : value }));
      setReminderStep("contact");
      addBotMessage("Contact number for reminders?");
      return true;
    }

    if (!contactPattern.test(value)) {
      addBotMessage("Please enter a valid contact number.");
      return true;
    }

    const finalData = { ...reminderData, contact: value };
    setSending(true);
    try {
      const saved = await createMedicationReminder(finalData);
      setReminderStep(null);
      addBotMessage(
        `Medication reminder saved.\nReference ID: ${saved?.id || "N/A"}\n\nPatient: ${finalData.patientName}\nMedicine: ${finalData.medicineName}\nDosage: ${finalData.dosage}\nFrequency: ${finalData.frequency}\nStart: ${finalData.startDate}\nEnd: ${finalData.endDate || "-"}\nContact: ${finalData.contact}`,
      );
    } catch (error) {
      addBotMessage(
        error instanceof Error
          ? error.message
          : "Unable to save medication reminder. Please try again.",
      );
    } finally {
      setSending(false);
    }
    return true;
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || sending) return;

    console.log("📤 Sending:", messageText);

    const userMsg: Message = {
      id: Date.now(),
      text: messageText,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    if (await handleReminderFlow(messageText)) {
      return;
    }

    if (await handleAppointmentFlow(messageText)) {
      return;
    }

    if (reminderIntentPattern.test(messageText)) {
      startReminderFlow();
      return;
    }

    if (appointmentIntentPattern.test(messageText)) {
      startAppointmentFlow();
      return;
    }

    setSending(true);

    // ⏱️ fallback if backend slow
    const slowTimer = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Still thinking... (backend slow)",
          sender: "bot",
        },
      ]);
    }, 5000);

    try {
      const res = await sendMessage(messageText);

      console.log("📥 API RESPONSE:", res);

      // 🔥 Normalize ALL possible response shapes
      const botText =
        res?.message ||
        res?.data?.message ||
        (typeof res === "string" ? res : null) ||
        "No response from server";

      const botMsg: Message = {
        id: Date.now() + 1,
        text: botText,
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("❌ Chat error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Backend error. Please try again.";

      const errorMsg: Message = {
        id: Date.now() + 1,
        text: message,
        sender: "bot",
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      clearTimeout(slowTimer);
      setSending(false);
    }
  };

  const handleVoiceToggle = () => {
    if (!speechSupported || sending) return;

    if (isNativeMobile) {
      if (isListening) {
        SpeechRecognition.stop();
        setIsListening(false);
        return;
      }

      SpeechRecognition.start({
        language: "en-US",
        maxResults: 1,
        partialResults: true,
        popup: false,
      });
      setIsListening(true);
      return;
    }

    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    recognitionRef.current.start();
    setIsListening(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 w-full h-[100dvh] bg-white rounded-none shadow-2xl flex flex-col overflow-hidden border border-gray-200 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[380px] sm:max-w-[calc(100vw-2rem)] sm:h-[520px] sm:rounded-2xl">
      
      {/* Header */}
      <div className="bg-maroon px-3 py-3 flex items-center justify-between sm:px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">
              Health Assistant Bot
            </h3>
            <p className="text-white/70 text-xs">Healthcare text chat</p>
          </div>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => setShowVoiceSettings((prev) => !prev)}
            className="text-white p-1 text-xs"
            title="Voice settings"
          >
            Voice
          </button>
          <button
            onClick={() => setVoiceOutputEnabled((prev) => !prev)}
            className="text-white p-1"
            title={voiceOutputEnabled ? "Disable voice output" : "Enable voice output"}
          >
            {voiceOutputEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
          <button onClick={onClose} className="text-white p-1">
            <Minus className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      {showVoiceSettings && (
        <div className="bg-white border-b border-gray-200 px-3 py-2 space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600 w-16">Voice</label>
            <select
              value={selectedVoiceURI}
              onChange={(e) => setSelectedVoiceURI(e.target.value)}
              className="flex-1 border rounded px-2 py-1 text-xs"
            >
              {availableVoices.length === 0 ? (
                <option value="">Default</option>
              ) : (
                availableVoices.map((voice) => (
                  <option key={voice.voiceURI} value={voice.voiceURI}>
                    {voice.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-600 w-16">Rate</label>
            <input
              type="range"
              min="0.7"
              max="1.3"
              step="0.1"
              value={speechRate}
              onChange={(e) => setSpeechRate(Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-xs text-gray-600 w-8">{speechRate.toFixed(1)}</span>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 sm:p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${
              msg.sender === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            {msg.sender === "bot" && (
              <div className="w-6 h-6 bg-maroon rounded-full flex items-center justify-center">
                <Bot className="w-3 h-3 text-white" />
              </div>
            )}

            <div
              className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                msg.sender === "user"
                  ? "bg-maroon text-white"
                  : "bg-white border"
              }`}
            >
              {msg.text}
            </div>

            {msg.sender === "user" && (
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {sending && (
          <div className="flex gap-2">
            <Bot className="w-4 h-4 text-maroon" />
            <p className="text-sm text-gray-500">Typing...</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && (
        <div className="p-2 border-t overflow-x-auto whitespace-nowrap">
          {quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="text-xs border px-2 py-1 m-1 rounded inline-block"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t flex gap-2 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border px-3 py-2 rounded text-base"
          placeholder="Ask..."
          disabled={sending}
        />
        <button
          onClick={handleVoiceToggle}
          disabled={!speechSupported || sending}
          className={`px-3 rounded ${
            isListening ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
          title={
            speechSupported
              ? isListening
                ? "Stop voice input"
                : "Start voice input"
              : "Voice input not supported in this browser"
          }
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        </button>

        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || sending}
          className="bg-maroon text-white px-3 rounded"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}