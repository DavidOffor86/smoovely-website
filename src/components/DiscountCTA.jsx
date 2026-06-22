"use client";

import { useState } from "react";

export default function DiscountCTA() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Submission failed");
      setSubmitted(true);
    } catch (err) {
      setError("Sorry, something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-center gap-3">
        <p className="text-sm text-slate-700">You may be eligible for a discount</p>
        <button
          onClick={() => setOpen((s) => !s)}
          className="inline-flex items-center gap-2 rounded-full bg-green px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green/95"
        >
          ✅ Yes – Check Eligibility
        </button>
      </div>

      <div
        className={`mt-4 overflow-hidden transition-all duration-300 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        aria-hidden={!open}
      >
        {!submitted ? (
          <form onSubmit={submit} className="mx-auto max-w-md rounded-lg bg-white p-4 shadow">
            <p className="mb-3 text-sm text-slate-600">An agent will be in touch within 24 hours to help you claim your discount.</p>
            <div className="grid gap-2 sm:grid-cols-3">
              <input
                className="col-span-1 rounded border p-2"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="rounded border p-2"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                className="rounded border p-2"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            <div className="mt-3 flex justify-end">
              <button type="submit" disabled={loading} className="rounded bg-blue-600 px-4 py-2 text-white">
                {loading ? "Sending…" : "Submit"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mx-auto max-w-md rounded-lg bg-green/10 p-4 text-center text-sm text-green">
            Thank you — an agent will be in touch within 24 hours.
          </div>
        )}
      </div>
    </div>
  );
}
