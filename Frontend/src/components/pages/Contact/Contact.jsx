import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${BACKEND}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        navigate("/thankyou");
        setFormData({ name: '', email: '', message: '' });
      } else {
        setError('Failed to send message. Please try again.');
      }
    } catch {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-background font-manrope">
      {/* Hero banner */}
      <div className="bg-primary-container py-16 px-6 text-center">
        <span className="material-symbols-outlined text-on-primary-container text-5xl mb-4 block">contact_support</span>
        <h1 className="font-headline-lg text-headline-lg text-on-primary mb-3">Get in Touch</h1>
        <p className="font-body-md text-body-md text-on-primary-container max-w-xl mx-auto">
          Have a question, concern, or feedback? Our care team typically responds within 24 hours.
        </p>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* Left — contact info */}
        <div className="space-y-8">
          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface mb-2">We&apos;re here to help</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Whether you need help booking an appointment, have a billing question, or want to give feedback — reach out and we'll get back to you promptly.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: "mail", label: "Email", value: "support@medimentor.health" },
              { icon: "call", label: "Phone", value: "+91 98765 43210" },
              { icon: "schedule", label: "Hours", value: "Mon – Sat, 9 AM – 6 PM IST" },
              { icon: "location_on", label: "Address", value: "MediMentor HQ, Bengaluru, Karnataka 560001" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-start gap-4 p-4 bg-surface-container-lowest border border-outline-variant/50 rounded-xl shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary-container text-xl">{icon}</span>
                </div>
                <div>
                  <div className="font-label-md text-label-md text-on-surface-variant">{label}</div>
                  <div className="font-body-md text-body-md text-on-surface">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-2xl shadow-sm p-8">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-600 text-3xl">check_circle</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Message Sent!</h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xs">
                Thank you for reaching out. We&apos;ll get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-2 px-6 py-2.5 bg-primary-container text-on-primary font-label-md rounded-lg hover:bg-primary transition-colors"
              >
                Send Another
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Send us a message</h3>

              {error && (
                <div className="mb-4 px-4 py-3 bg-error-container text-on-error-container rounded-lg font-label-md text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface">Full Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-base">person</span>
                    <input
                      type="text" name="name" value={formData.name} onChange={handleChange} required
                      placeholder="Jane Doe"
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface font-body-md placeholder:text-outline outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/30 transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-base">mail</span>
                    <input
                      type="email" name="email" value={formData.email} onChange={handleChange} required
                      placeholder="jane@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface font-body-md placeholder:text-outline outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/30 transition-all"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="font-label-md text-label-md text-on-surface">Message</label>
                  <textarea
                    name="message" value={formData.message} onChange={handleChange} required rows={5}
                    placeholder="Describe your question or concern..."
                    className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/50 rounded-lg text-on-surface font-body-md placeholder:text-outline outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container/30 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit" disabled={loading}
                  className="w-full py-3 bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md rounded-lg transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><span className="material-symbols-outlined text-base animate-spin">progress_activity</span> Sending...</>
                  ) : (
                    <><span className="material-symbols-outlined text-base">send</span> Send Message</>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
