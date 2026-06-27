import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(10);

  // Auto-redirect countdown
  useEffect(() => {
    if (count === 0) { navigate("/"); return; }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <div className="min-h-screen bg-background font-manrope flex flex-col items-center justify-center px-6 py-16">
      {/* Animated checkmark circle */}
      <div className="relative mb-8">
        <div className="w-28 h-28 rounded-full bg-emerald-100 flex items-center justify-center animate-[scale-in_0.4s_ease-out]">
          <div className="w-20 h-20 rounded-full bg-emerald-200 flex items-center justify-center">
            <span className="material-symbols-outlined text-emerald-600 text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
          </div>
        </div>
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-full border-2 border-emerald-300 animate-ping opacity-30" />
      </div>

      {/* Heading */}
      <h1 className="font-headline-lg text-headline-lg text-on-surface text-center mb-3">
        Message Received!
      </h1>
      <p className="font-body-md text-body-md text-on-surface-variant text-center max-w-md mb-10">
        Thank you for reaching out to MediMentor. Our care team will review your message and get back to you within <strong className="text-on-surface">24 hours</strong>.
      </p>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-10">
        {[
          { icon: "schedule", title: "Response Time", desc: "Within 24 hours" },
          { icon: "support_agent", title: "Support Hours", desc: "Mon–Sat, 9AM–6PM IST" },
          { icon: "mail", title: "Email Us", desc: "support@medimentor.health" },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-5 text-center shadow-sm">
            <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-primary-container text-xl">{icon}</span>
            </div>
            <div className="font-label-md text-label-md text-on-surface mb-1">{title}</div>
            <div className="font-caption text-caption text-on-surface-variant">{desc}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <button
          onClick={() => navigate("/")}
          className="flex-1 py-3 bg-primary-container text-on-primary font-label-md rounded-lg hover:bg-primary transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-base">home</span>
          Back to Home
        </button>
        <button
          onClick={() => navigate("/bookappointment")}
          className="flex-1 py-3 border border-outline-variant/50 text-on-surface font-label-md rounded-lg hover:bg-surface-container transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-base">calendar_add_on</span>
          Book Appointment
        </button>
      </div>

      {/* Countdown */}
      <p className="mt-8 font-caption text-caption text-outline">
        Redirecting to home in <span className="text-primary-container font-semibold">{count}s</span>
      </p>
    </div>
  );
};

export default ThankYou;
