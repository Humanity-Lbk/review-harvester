"use client";

import { useState } from "react";

const SOFTWARE_OPTIONS = [
  "Google Sheets / Spreadsheets",
  "Square",
  "Jobber",
  "ServiceTitan",
  "QuickBooks",
  "Salesforce",
  "HubSpot",
  "Mindbody",
  "Toast POS",
  "Other / Not sure",
];

export default function Home() {
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    email: "",
    phone: "",
    googleProfileUrl: "",
    notSureProfile: false,
    software: "",
    softwareOther: "",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const target = e.target;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;
    setFormData((prev) => ({ ...prev, [target.name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Submit failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-full">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 md:px-16 lg:px-24 py-6 border-b-2 border-[var(--bark)]">
        <div
          className="text-2xl tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Humanity AI
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[var(--bark-soft)]">806-773-2106</span>
          <span className="text-[var(--bark-soft)]">&middot;</span>
          <span className="text-[var(--bark-soft)]">gethumanity.ai</span>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 md:px-16 lg:px-24 pt-16 md:pt-24 pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--forest)] mb-6">
              The Lubbock Chamber + Humanity AI
            </p>
            <h1
              className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] tracking-tight mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Your reviews.
              <br />
              On autopilot.
            </h1>
            <p className="text-lg md:text-xl text-[var(--bark-soft)] max-w-xl leading-relaxed mb-4">
              The Lubbock Chamber has partnered with Humanity AI to help boost
              your Google reviews and grow your presence online. Generate 10 new
              Google reviews a month, automatically.
            </p>
            <p
              className="text-lg text-[var(--forest)] font-medium"
              style={{ fontFamily: "var(--font-accent)", fontStyle: "italic" }}
            >
              Completely free for all chamber members.
            </p>
          </div>
          <div className="hidden lg:flex flex-col items-center justify-center">
            <div className="flex gap-3 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-12 h-12 text-[var(--forest)]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <p
              className="text-6xl tracking-tight text-[var(--bark)] text-center leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              10 reviews
              <br />
              <span
                className="text-[var(--forest)]"
                style={{
                  fontFamily: "var(--font-accent)",
                  fontStyle: "italic",
                }}
              >
                every month
              </span>
            </p>
            <p className="text-sm text-[var(--bark-soft)] mt-4 tracking-wide uppercase font-medium">
              Real customers &middot; Real reviews &middot; Zero effort
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-8 md:px-16 lg:px-24 py-12 md:py-16 bg-[var(--bark)] text-[var(--cream)]">
        <div className="max-w-7xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[var(--sage)] mb-10">
          How it works
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {[
            {
              num: "01",
              title: "Fill out the form below",
              desc: "Tell us about your business. Takes about two minutes.",
            },
            {
              num: "02",
              title: "We handle the setup",
              desc: "We connect your Google Business Profile and configure your Review Accelerator.",
            },
            {
              num: "03",
              title: "Reviews roll in",
              desc: "AI reaches out to your real customers. 10 reviews a month, real people, zero hassle.",
            },
          ].map((step) => (
            <div key={step.num}>
              <span
                className="text-4xl md:text-5xl font-normal text-[var(--sage)] opacity-30 block mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {step.num}
              </span>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-[var(--cream)] opacity-60 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* Form section */}
      <section id="form" className="px-8 md:px-16 lg:px-24 py-16 md:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        <div>
          <h2
            className="text-3xl md:text-4xl tracking-tight mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Claim your free account
          </h2>
          <p className="text-[var(--bark-soft)] mb-10">
            No contract. No credit card. We&rsquo;ll reach out within one
            business day to get you set up.
          </p>

          {status === "success" ? (
            <div className="rounded-xl bg-[var(--forest-light)] border border-[var(--forest)] p-8">
              <h3
                className="text-2xl mb-2 text-[var(--forest)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                You&rsquo;re in.
              </h3>
              <p className="text-[var(--bark-soft)]">
                We&rsquo;ll be in touch within one business day to get your
                Review Accelerator set up. Keep an eye on your email and phone.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business name */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  Business name{" "}
                  <span className="text-[var(--forest)]">*</span>
                </label>
                <input
                  type="text"
                  name="businessName"
                  required
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="e.g. Lubbock Family Dental"
                  className="w-full px-4 py-3 rounded-lg border-2 border-[var(--cream-dark)] bg-[var(--warm-white)] text-[var(--bark)] placeholder:text-[var(--bark-soft)] placeholder:opacity-50 focus:border-[var(--forest)] focus:outline-none transition-colors"
                />
              </div>

              {/* Contact name */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  Your name <span className="text-[var(--forest)]">*</span>
                </label>
                <input
                  type="text"
                  name="contactName"
                  required
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="First and last name"
                  className="w-full px-4 py-3 rounded-lg border-2 border-[var(--cream-dark)] bg-[var(--warm-white)] text-[var(--bark)] placeholder:text-[var(--bark-soft)] placeholder:opacity-50 focus:border-[var(--forest)] focus:outline-none transition-colors"
                />
              </div>

              {/* Email + Phone row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    Email <span className="text-[var(--forest)]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@business.com"
                    className="w-full px-4 py-3 rounded-lg border-2 border-[var(--cream-dark)] bg-[var(--warm-white)] text-[var(--bark)] placeholder:text-[var(--bark-soft)] placeholder:opacity-50 focus:border-[var(--forest)] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    Phone <span className="text-[var(--forest)]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(806) 555-1234"
                    className="w-full px-4 py-3 rounded-lg border-2 border-[var(--cream-dark)] bg-[var(--warm-white)] text-[var(--bark)] placeholder:text-[var(--bark-soft)] placeholder:opacity-50 focus:border-[var(--forest)] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Google Profile */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  Google Business Profile link
                </label>
                <input
                  type="url"
                  name="googleProfileUrl"
                  value={formData.googleProfileUrl}
                  onChange={handleChange}
                  disabled={formData.notSureProfile}
                  placeholder="https://g.co/kgs/..."
                  className="w-full px-4 py-3 rounded-lg border-2 border-[var(--cream-dark)] bg-[var(--warm-white)] text-[var(--bark)] placeholder:text-[var(--bark-soft)] placeholder:opacity-50 focus:border-[var(--forest)] focus:outline-none transition-colors disabled:opacity-40"
                />
                <label className="flex items-center gap-2 mt-2 text-sm text-[var(--bark-soft)] cursor-pointer">
                  <input
                    type="checkbox"
                    name="notSureProfile"
                    checked={formData.notSureProfile}
                    onChange={handleChange}
                    className="accent-[var(--forest)] w-4 h-4"
                  />
                  Not sure &mdash; help me find it
                </label>
              </div>

              {/* Software */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">
                  What software do you use to manage customers?
                </label>
                <select
                  name="software"
                  value={formData.software}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-[var(--cream-dark)] bg-[var(--warm-white)] text-[var(--bark)] focus:border-[var(--forest)] focus:outline-none transition-colors"
                >
                  <option value="">Select one (optional)</option>
                  {SOFTWARE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {formData.software === "Other / Not sure" && (
                  <input
                    type="text"
                    name="softwareOther"
                    value={formData.softwareOther}
                    onChange={handleChange}
                    placeholder="What do you use?"
                    className="w-full mt-3 px-4 py-3 rounded-lg border-2 border-[var(--cream-dark)] bg-[var(--warm-white)] text-[var(--bark)] placeholder:text-[var(--bark-soft)] placeholder:opacity-50 focus:border-[var(--forest)] focus:outline-none transition-colors"
                  />
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex items-center gap-2 px-10 py-4 rounded-lg bg-[var(--forest)] text-[var(--cream)] font-semibold text-base hover:bg-[var(--forest-dark)] transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-wait"
              >
                {status === "submitting" ? (
                  "Submitting..."
                ) : (
                  <>
                    Claim Your Free Account
                    <span className="text-lg">&rarr;</span>
                  </>
                )}
              </button>

              {status === "error" && (
                <p className="text-red-600 text-sm">
                  Something went wrong. Please try again or call us at
                  806-773-2106.
                </p>
              )}
            </form>
          )}
        </div>
        {/* Right side — trust signals on desktop */}
        <div className="hidden lg:flex flex-col justify-center gap-10">
          <div className="rounded-2xl bg-[var(--warm-white)] border-2 border-[var(--cream-dark)] p-8">
            <p
              className="text-2xl tracking-tight mb-4 text-[var(--bark)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              What you get
            </p>
            <ul className="space-y-4">
              {[
                "10 new Google reviews every month",
                "AI-powered outreach to real customers",
                "Works with your existing tools",
                "Setup handled for you — no tech skills needed",
                "No contract, cancel anytime",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-[var(--forest)] mt-0.5 flex-shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-[var(--bark-soft)] text-sm leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-[var(--forest)] p-8 text-[var(--cream)]">
            <p className="text-sm font-semibold uppercase tracking-widest text-[var(--sage)] mb-3">
              Questions?
            </p>
            <p className="text-sm leading-relaxed opacity-80 mb-4">
              Call or text Josiah directly. Happy to walk you through it.
            </p>
            <p
              className="text-xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              806-773-2106
            </p>
          </div>
        </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 md:px-16 lg:px-24 py-8 border-t-2 border-[var(--cream-dark)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <span
            className="text-xl tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Humanity AI
          </span>
          <span className="text-sm text-[var(--bark-soft)]">
            A partnership bringing free review automation to every Lubbock
            Chamber member.
          </span>
        </div>
        <div className="text-sm text-[var(--bark-soft)]">
          806-773-2106 &nbsp;&middot;&nbsp; gethumanity.ai
        </div>
      </footer>
    </main>
  );
}
