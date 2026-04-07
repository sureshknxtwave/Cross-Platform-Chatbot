import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import HeroSection from "../components/HeroSection";
import AboutSection from "../components/AboutSection";
import AchievementsSection from "../components/AchievementsSection";
import ServicesSection from "../components/CoursesSection";
import QuotesSection from "../components/QuotesSection";
import DoctorsSection from "../components/MentorsSection";
import CareExperienceSection from "../components/StudentLifeSection";
import CareHighlightsGallery from "../components/EventsGallery";
import CareAssistantCTA from "../components/CounselorCTA";
import OutcomesSection from "../components/HiringStatsSection";
import Footer from "../components/Footer";
import SignupPopup from "../components/SignupPopup";
import CallPopup from "../components/CallPopup";

export default function HomePage() {
  const { user } = useAuth();
  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [showCallPopup, setShowCallPopup] = useState(false);

  // When non-logged visitor scrolls to mentors section — show signup popup once per session
  const handleReachDoctors = () => {
    if (!user && !sessionStorage.getItem("popupShown")) {
      setShowSignupPopup(true);
      sessionStorage.setItem("popupShown", "true");
    }
  };

  return (
    <div>
      {/* Always visible sections */}
      <HeroSection />
      <AboutSection />
      <AchievementsSection />
      <ServicesSection />
      <QuotesSection />

      {/* Doctors section — visible to all, but triggers popup for non-logged */}
      <DoctorsSection onReachDoctors={handleReachDoctors} />

      {/* Everything below Doctors is ONLY visible to logged-in users */}
      {user ? (
        <>
          <CareExperienceSection />
          <CareHighlightsGallery />
          <CareAssistantCTA onOpenCall={() => setShowCallPopup(true)} />
          <OutcomesSection />
          <Footer />
        </>
      ) : (
        /* For non-logged users, show a teaser section prompting signup */
        <section className="py-0 bg-cream text-center ">
          <div className="max-w-2xl mx-auto px-4">
            <h2 className="font-heading text-3xl font-bold text-gray-900 mb-4">
              Want to See More?
            </h2>
            <p className="text-gray-500 mb-8">
              Sign up to track appointments, medication reminders, and full healthcare insights.
            </p>
            <button
              onClick={() => setShowSignupPopup(true)}
              className="bg-maroon text-white px-8 py-3 rounded-lg font-semibold hover:bg-maroon-dark transition-colors duration-200 mb-8"
            >
              Sign Up to Unlock
            </button>
          </div>
          <Footer />
        </section>
      )}

      {/* Popups */}
      <SignupPopup show={showSignupPopup} onClose={() => setShowSignupPopup(false)} />
      <CallPopup open={showCallPopup} onClose={() => setShowCallPopup(false)} />
    </div>
  );
}