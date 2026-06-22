"use client";

import { useState } from "react";

/* ---------------------------------------------------------------------------
 * Contact form — simple state handling + required-field validation.
 * Posts to /api/contact, which is wired to forward to the same submission
 * pipeline as quotes (Power Automate / email). Self-contained.
 * ------------------------------------------------------------------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | done | error

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.email.trim()) e.email = "Please enter your email.";
    else if (!EMAIL_RE.test(form.email)) e.email = "Please enter a valid email.";
    if (!form.message.trim()) e.message = "Please enter a message.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev) => {
    ev.preventDefault();
    if (status === "sending") return;
    if (!validate()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, submittedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setStatus("done");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-green/30 bg-green/5 p-8 text-center">
        <h3 className="text-lg font-semibold text-navy">Message sent</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Thanks for getting in touch — our team will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-semibold text-green transition hover:text-green/80"
        >
          Send another message
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 p-3 text-sm text-navy outline-none transition focus:border-green focus:ring-2 focus:ring-green/30";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-navy">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className={inputClass}
          placeholder="Your full name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-navy">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className={inputClass}
            placeholder="you@email.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-navy">
            Phone
          </label>
          <input
            type="tel"
            className={inputClass}
            placeholder="07…"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-navy">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={5}
          className={inputClass}
          placeholder="How can we help?"
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-500">{errors.message}</p>
        )}
      </div>

      {status === "error" && (
        <p className="text-sm text-red-500">
          Something went wrong. Please try again, or email us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center rounded-lg bg-green px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-green/25 transition hover:bg-green/90 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
