"use client";

import { useState } from "react";

/* ---------------------------------------------------------------------------
 * Final-step CTA for each configurator flow. Submits the full quote (service,
 * contact details, all answers, estimate, timestamp) to /api/quote, then shows
 * an inline confirmation. Keeps the original button styling/label untouched.
 * ------------------------------------------------------------------------- */

export default function SubmitQuoteButton({ service, form, estimate, label = "Get My Quote" }) {
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  const submit = async () => {
    console.log("[SubmitQuoteButton] 1. submit() called", { service, status });
    if (status === "sending" || status === "done") {
      console.log("[SubmitQuoteButton] aborted — already", status);
      return;
    }
    setStatus("sending");
    try {
      console.log("[SubmitQuoteButton] 2. sending fetch → /api/quote");
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service,
          name: form?.name || "",
          email: form?.email || "",
          phone: form?.phone || "",
          estimate,
          currency: "GBP",
          details: form || {},
          source: "quote-configurator",
          submittedAt: new Date().toISOString(),
        }),
      });
      console.log("[SubmitQuoteButton] 3. response status:", res.status, "ok:", res.ok);
      if (!res.ok) throw new Error(`Submission failed (${res.status})`);
      console.log("[SubmitQuoteButton] 4. success");
      setStatus("done");
    } catch (err) {
      // Surface the real reason instead of swallowing it.
      console.error("[SubmitQuoteButton] submit failed:", err);
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="w-full rounded-lg bg-green-50 px-6 py-3 text-center text-sm font-semibold text-green-800 ring-1 ring-green-200">
        ✅ Request sent — our team will be in touch shortly to confirm your quote.
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={submit}
        disabled={status === "sending"}
        className="w-full rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        {status === "sending" ? "Sending…" : label}
      </button>
      {status === "error" && (
        <p className="mt-2 text-sm text-red-500">
          Something went wrong. Please try again, or call us to confirm.
        </p>
      )}
    </>
  );
}
