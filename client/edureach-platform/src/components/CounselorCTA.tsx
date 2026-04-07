import { useNavigate } from "react-router-dom";
import { images } from "../data/content";
import { PhoneCall } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface CareAssistantCTAProps {
  onOpenCall: () => void;
}

export default function CareAssistantCTA({ onOpenCall }: CareAssistantCTAProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (user) {
      onOpenCall();
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="relative py-20 overflow-hidden">
      <img src={images.moreStudents} alt="Students" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-maroon-dark/80" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <p className="text-amber-300 font-semibold text-sm uppercase tracking-wider mb-3">
          Our Care Team Is Just a Click Away
        </p>
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
          Need Help With <br className="hidden sm:block" />
          Your Health Concern?
        </h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
          Get personalized guidance on symptoms, appointments, medication reminders, and next care steps.
        </p>
        <button
          onClick={handleClick}
          className="inline-flex items-center gap-2 bg-white text-maroon px-8 py-4 rounded-xl font-semibold text-lg hover:bg-amber-300 hover:text-maroon-dark transition-colors duration-300 shadow-lg"
        >
          <PhoneCall className="w-5 h-5" />
          Talk to Care Assistant
        </button>
      </div>
    </section>
  );
}