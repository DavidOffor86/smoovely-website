"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------------------------------------------------------------------
 * Discount eligibility CTA for the configurator's final quote step.
 * - Autofills the customer details already captured earlier (name/email/phone).
 * - Inline expansion + confirmation, no page reload (matches the flow UX).
 * - Posts to the existing /api/discount endpoint.
 * ------------------------------------------------------------------------- */

export default function DiscountEligibility({ name = "", email = "", phone = "" }) {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const confirm = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, source: "quote-configurator" }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setConfirmed(true);
    } catch {
      setError("Sorry, something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const Detail = ({ label, value }) => (
    <div className="flex items-start justify-between gap-3">
      <dt className="font-medium text-gray-500">{label}</dt>
      <dd className="break-all text-right text-gray-700">{value || "—"}</dd>
    </div>
  );

  return (
    <div className="mt-5 border-t border-gray-100 pt-5 text-center">
      {!open && !confirmed && (
        <>
          <p className="mb-3 text-sm font-medium text-gray-700">
            You may be eligible for a discount
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            ✅ Yes – Check Eligibility
          </button>
        </>
      )}

      <AnimatePresence initial={false} mode="wait">
        {open && (
          <motion.div
            key={confirmed ? "done" : "form"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {!confirmed ? (
              <div className="rounded-xl border border-green-200 bg-green-50/60 p-4 text-left">
                <p className="text-sm text-gray-700">
                  Confirm your details below and an agent will be in touch within
                  24 hours so you can claim your discount.
                </p>
                <dl className="mt-3 space-y-1.5 text-sm">
                  <Detail label="Name" value={name} />
                  <Detail label="Email" value={email} />
                  <Detail label="Phone" value={phone} />
                </dl>
                {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
                <button
                  type="button"
                  onClick={confirm}
                  disabled={loading}
                  className="mt-4 w-full rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {loading ? "Confirming…" : "Confirm details and receive callback"}
                </button>
                <p className="mt-2 text-center text-xs text-gray-400">
                  By confirming you agree for an agent to contact you about your
                  discount.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-800">
                ✅ An agent will be in touch within 24 hours so you can claim your
                discount.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
