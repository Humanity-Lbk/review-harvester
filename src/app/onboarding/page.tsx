"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const CRM_OPTIONS = [
  { value: "", label: "Select your software" },
  { value: "ghl", label: "GoHighLevel (GHL)" },
  { value: "hubspot", label: "HubSpot" },
  { value: "salesforce", label: "Salesforce" },
  { value: "jobber", label: "Jobber" },
  { value: "servicetitan", label: "ServiceTitan" },
  { value: "housecall", label: "Housecall Pro" },
  { value: "mindbody", label: "Mindbody" },
  { value: "jane", label: "Jane App" },
  { value: "dentrix", label: "Dentrix" },
  { value: "eaglesoft", label: "Eaglesoft" },
  { value: "opendental", label: "Open Dental" },
  { value: "toast", label: "Toast POS" },
  { value: "square", label: "Square" },
  { value: "quickbooks", label: "QuickBooks" },
  { value: "sheets", label: "Google Sheets / Spreadsheets" },
  { value: "brivity", label: "Brivity" },
  { value: "followupboss", label: "Follow Up Boss" },
  { value: "none", label: "I don't use any software" },
  { value: "other", label: "Other" },
];

const TRIGGER_OPTIONS = [
  { value: "", label: "Select what happens" },
  { value: "appointment_completed", label: "Appointment or visit is completed" },
  { value: "invoice_paid", label: "Invoice is paid" },
  { value: "job_closed", label: "Job or project is closed" },
  { value: "patient_checkout", label: "Patient checks out" },
  { value: "order_fulfilled", label: "Order is fulfilled or picked up" },
  { value: "manual", label: "I manually mark them as done" },
  { value: "no_process", label: "I don't really have a process for this" },
  { value: "other", label: "Other" },
];

const VOLUME_OPTIONS = [
  { value: "", label: "Select a range" },
  { value: "1-20", label: "1 – 20 per month" },
  { value: "21-50", label: "21 – 50 per month" },
  { value: "51-100", label: "51 – 100 per month" },
  { value: "100+", label: "100+ per month" },
  { value: "unsure", label: "Not sure" },
];

type Step = 1 | 2;

export default function OnboardingPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>(1);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [contactName, setContactName] = useState("");
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    setContactName(searchParams.get("name") || "");
    setBusinessName(searchParams.get("biz") || "");
  }, [searchParams]);

  const [formData, setFormData] = useState({
    crm: "",
    crmOther: "",
    trigger: "",
    triggerOther: "",
    customerVolume: "",
    hasZapier: "",
    contactMethod: "",
    currentReviewCount: "",
    currentRating: "",
    alreadyAsking: "",
    currentProcess: "",
    biggestChallenge: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const target = e.target;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;
    setFormData((prev) => ({ ...prev, [target.name]: value }));
  }

  function nextStep() {
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function prevStep() {
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, contactName, businessName }),
      });
      if (!res.ok) throw new Error("Submit failed");
      setStatus("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full px-5 py-4 rounded-xl border-2 border-[var(--cream-dark)] bg-[var(--warm-white)] text-[var(--bark)] placeholder:text-[var(--bark-soft)] placeholder:opacity-50 focus:border-[var(--forest)] focus:outline-none transition-colors text-base md:text-lg";
  const selectClass =
    "w-full px-5 py-4 rounded-xl border-2 border-[var(--cream-dark)] bg-[var(--warm-white)] text-[var(--bark)] focus:border-[var(--forest)] focus:outline-none transition-colors text-base md:text-lg";
  const labelClass = "block text-base md:text-lg font-semibold mb-2 text-[var(--bark)]";
  const hintClass = "text-sm text-[var(--bark-soft)] mb-3 leading-relaxed";
  const radioGroupClass = "flex flex-wrap gap-3";
  const radioClass =
    "flex items-center gap-3 px-5 py-3.5 rounded-xl border-2 border-[var(--cream-dark)] bg-[var(--warm-white)] cursor-pointer transition-colors has-[:checked]:border-[var(--forest)] has-[:checked]:bg-[var(--forest-light)] text-base";

  return (
    <main className="min-h-full flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 lg:px-24 py-5 border-b-2 border-[var(--bark)]">
        <div
          className="text-2xl tracking-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Humanity AI
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[var(--bark-soft)]">Review Accelerator</span>
        </div>
      </nav>

      <section className="flex-1 px-6 md:px-12 lg:px-0 py-10 md:py-16 lg:py-20">
        <div className="max-w-2xl mx-auto">
          {status === "success" ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--forest-light)] mb-8">
                <svg className="w-10 h-10 text-[var(--forest)]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2
                className="text-4xl md:text-5xl tracking-tight mb-5"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                You&rsquo;re all set.
              </h2>
              <p className="text-lg md:text-xl text-[var(--bark-soft)] max-w-lg mx-auto leading-relaxed mb-10">
                We have everything we need to get your Review Accelerator configured.
                We&rsquo;ll reach out within 24 hours with your setup details.
              </p>
              <div className="rounded-2xl bg-[var(--forest)] p-8 text-[var(--cream)] inline-block">
                <p className="text-base opacity-80 mb-2">Questions in the meantime?</p>
                <p className="text-2xl" style={{ fontFamily: "var(--font-heading)" }}>
                  806-773-2106
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-10 md:mb-12">
                <p className="text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-[var(--forest)] mb-4">
                  Quick Setup Questionnaire
                </p>
                <h1
                  className="text-4xl md:text-5xl tracking-tight mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  A few more details.
                </h1>
                <p className="text-lg text-[var(--bark-soft)] leading-relaxed">
                  This helps us configure your Review Accelerator without needing a phone call. Takes about 2 minutes.
                </p>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-3 mb-10 md:mb-12">
                <div className="h-2 flex-1 rounded-full transition-colors bg-[var(--forest)]" />
                <div className={`h-2 flex-1 rounded-full transition-colors ${step >= 2 ? "bg-[var(--forest)]" : "bg-[var(--cream-dark)]"}`} />
                <span className="text-sm text-[var(--bark-soft)] ml-2 whitespace-nowrap">
                  {step} of 2
                </span>
              </div>

              <form onSubmit={handleSubmit}>
                {/* STEP 1 — How They Work */}
                {step === 1 && (
                  <div className="space-y-8">
                    <div className="pb-3 border-b-2 border-[var(--cream-dark)]">
                      <h2 className="text-xl md:text-2xl font-semibold">How You Work</h2>
                      <p className="text-base text-[var(--bark-soft)] mt-1">
                        So we can figure out the best way to automate your review requests.
                      </p>
                    </div>

                    <div>
                      <label className={labelClass}>
                        What software do you use to manage customers or appointments? <span className="text-[var(--forest)]">*</span>
                      </label>
                      <select
                        name="crm"
                        required
                        value={formData.crm}
                        onChange={handleChange}
                        className={selectClass}
                      >
                        {CRM_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {formData.crm === "other" && (
                        <input
                          type="text"
                          name="crmOther"
                          value={formData.crmOther}
                          onChange={handleChange}
                          placeholder="What software do you use?"
                          className={`${inputClass} mt-3`}
                        />
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>
                        How do you know when a customer is &ldquo;done&rdquo;? <span className="text-[var(--forest)]">*</span>
                      </label>
                      <p className={hintClass}>
                        This is when we&rsquo;ll send the review request &mdash; what marks a completed visit or job?
                      </p>
                      <select
                        name="trigger"
                        required
                        value={formData.trigger}
                        onChange={handleChange}
                        className={selectClass}
                      >
                        {TRIGGER_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {formData.trigger === "other" && (
                        <input
                          type="text"
                          name="triggerOther"
                          value={formData.triggerOther}
                          onChange={handleChange}
                          placeholder="Describe what happens when a customer is done"
                          className={`${inputClass} mt-3`}
                        />
                      )}
                    </div>

                    <div>
                      <label className={labelClass}>
                        How many customers do you serve per month?
                      </label>
                      <select
                        name="customerVolume"
                        value={formData.customerVolume}
                        onChange={handleChange}
                        className={selectClass}
                      >
                        {VOLUME_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Do you use Zapier, Make, or any automation tools?
                      </label>
                      <div className={radioGroupClass}>
                        {["Yes", "No", "Not sure"].map((opt) => (
                          <label key={opt} className={radioClass}>
                            <input
                              type="radio"
                              name="hasZapier"
                              value={opt.toLowerCase().replace(" ", "_")}
                              checked={formData.hasZapier === opt.toLowerCase().replace(" ", "_")}
                              onChange={handleChange}
                              className="accent-[var(--forest)] w-4 h-4"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>
                        How do your customers prefer to hear from you?
                      </label>
                      <div className={radioGroupClass}>
                        {["Email", "Text / SMS", "Both"].map((opt) => (
                          <label key={opt} className={radioClass}>
                            <input
                              type="radio"
                              name="contactMethod"
                              value={opt.toLowerCase().replace(/ \/ /g, "_").replace(" ", "_")}
                              checked={formData.contactMethod === opt.toLowerCase().replace(/ \/ /g, "_").replace(" ", "_")}
                              onChange={handleChange}
                              className="accent-[var(--forest)] w-4 h-4"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-[var(--forest)] text-[var(--cream)] font-semibold hover:bg-[var(--forest-dark)] transition-colors cursor-pointer text-lg"
                      >
                        Next: Your Reviews <span>&rarr;</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2 — Current Review State */}
                {step === 2 && (
                  <div className="space-y-8">
                    <div className="pb-3 border-b-2 border-[var(--cream-dark)]">
                      <h2 className="text-xl md:text-2xl font-semibold">Your Reviews Today</h2>
                      <p className="text-base text-[var(--bark-soft)] mt-1">
                        Last step &mdash; where are you at with reviews right now?
                      </p>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Roughly how many Google reviews do you have?
                      </label>
                      <input
                        type="text"
                        name="currentReviewCount"
                        value={formData.currentReviewCount}
                        onChange={handleChange}
                        placeholder="e.g. 23, not sure, none"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        What&rsquo;s your current star rating?
                      </label>
                      <input
                        type="text"
                        name="currentRating"
                        value={formData.currentRating}
                        onChange={handleChange}
                        placeholder="e.g. 4.6, not sure"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>
                        Are you currently asking customers for reviews?
                      </label>
                      <div className={radioGroupClass}>
                        {["Yes, regularly", "Sometimes", "Rarely / never"].map((opt) => (
                          <label key={opt} className={radioClass}>
                            <input
                              type="radio"
                              name="alreadyAsking"
                              value={opt.toLowerCase().replace(/ \/ /g, "_").replace(/, /g, "_").replace(" ", "_")}
                              checked={formData.alreadyAsking === opt.toLowerCase().replace(/ \/ /g, "_").replace(/, /g, "_").replace(" ", "_")}
                              onChange={handleChange}
                              className="accent-[var(--forest)] w-4 h-4"
                            />
                            <span>{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {(formData.alreadyAsking === "yes_regularly" || formData.alreadyAsking === "sometimes") && (
                      <div>
                        <label className={labelClass}>
                          How are you asking today?
                        </label>
                        <input
                          type="text"
                          name="currentProcess"
                          value={formData.currentProcess}
                          onChange={handleChange}
                          placeholder="e.g. Hand them a card, text a link, QR code at front desk..."
                          className={inputClass}
                        />
                      </div>
                    )}

                    <div>
                      <label className={labelClass}>
                        What&rsquo;s the biggest challenge with getting reviews?
                      </label>
                      <textarea
                        name="biggestChallenge"
                        value={formData.biggestChallenge}
                        onChange={handleChange}
                        rows={3}
                        placeholder="e.g. We forget to ask, patients say they will but don't, no system in place..."
                        className={inputClass}
                        style={{ resize: "vertical" }}
                      />
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-[var(--cream-dark)] text-[var(--bark-soft)] font-semibold hover:border-[var(--bark)] hover:text-[var(--bark)] transition-colors cursor-pointer text-lg"
                      >
                        <span>&larr;</span> Back
                      </button>
                      <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-[var(--forest)] text-[var(--cream)] font-semibold hover:bg-[var(--forest-dark)] transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-wait text-lg"
                      >
                        {status === "submitting" ? "Submitting..." : "Submit & Get Set Up"}
                      </button>
                    </div>

                    {status === "error" && (
                      <p className="text-red-600 text-sm mt-4">
                        Something went wrong. Please try again or call us at 806-773-2106.
                      </p>
                    )}
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 lg:px-24 py-6 border-t-2 border-[var(--cream-dark)] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span
            className="text-lg tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Humanity AI
          </span>
          <span className="text-sm text-[var(--bark-soft)]">
            Review Accelerator
          </span>
        </div>
        <div className="text-sm text-[var(--bark-soft)]">
          806-773-2106 &nbsp;&middot;&nbsp; gethumanity.ai
        </div>
      </footer>
    </main>
  );
}
