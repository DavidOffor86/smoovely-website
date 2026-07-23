/* ---------------------------------------------------------------------------
 * Customer feedback record builders (pure — no framework/network deps).
 *
 * Turns a submitted feedback form into:
 *   - a FLAT record for Power Automate / Microsoft Lists / Excel / CRM
 *     (one key = one column)
 *   - a formatted plain-text notification email
 *
 * The NPS category is ALWAYS re-derived here from the raw score so the stored
 * value can never be tampered with client-side (mirrors the server re-price in
 * the quote pipeline).
 * ------------------------------------------------------------------------- */

/** Promoter 9–10 · Passive 7–8 · Detractor 0–6. */
export function npsCategory(score) {
  const n = Number(score);
  if (!Number.isFinite(n)) return "";
  if (n >= 9) return "Promoter";
  if (n >= 7) return "Passive";
  return "Detractor";
}

// Coerce a rating to an int within [min,max], or "" when unanswered.
const clampInt = (v, min, max) => {
  const n = Math.round(Number(v));
  if (!Number.isFinite(n)) return "";
  return Math.min(max, Math.max(min, n));
};

/** Flat record — every key maps 1:1 to an Excel / Power Automate column. */
export function buildFeedbackRecord({ feedback = {}, timestamp }) {
  const npsScore = clampInt(feedback.npsScore, 0, 10);
  return {
    timestamp,
    type: "customer-feedback",

    overallSatisfaction: clampInt(feedback.overallSatisfaction, 1, 10),

    npsScore,
    npsCategory: npsScore === "" ? "" : npsCategory(npsScore),

    professionalism: clampInt(feedback.professionalism, 1, 5),
    communication: clampInt(feedback.communication, 1, 5),
    punctuality: clampInt(feedback.punctuality, 1, 5),
    careOfItems: clampInt(feedback.careOfItems, 1, 5),

    wouldUseAgain: feedback.wouldUseAgain || "",

    positiveFeedback: (feedback.positiveFeedback || "").trim(),
    improvementFeedback: (feedback.improvementFeedback || "").trim(),

    source: "feedback-page",
  };
}

/** Formatted plain-text notification email. */
export function buildFeedbackEmailText(record) {
  const scale = (v, max) => (v === "" || v == null ? "—" : `${v}/${max}`);
  const when = (() => {
    try {
      return new Date(record.timestamp).toLocaleString("en-GB", {
        dateStyle: "long",
        timeStyle: "short",
      });
    } catch {
      return record.timestamp;
    }
  })();

  return [
    "New customer feedback",
    "",
    `Overall Satisfaction: ${scale(record.overallSatisfaction, 10)}`,
    `NPS Score: ${scale(record.npsScore, 10)}`,
    `NPS Category: ${record.npsCategory || "—"}`,
    "",
    `Professionalism: ${scale(record.professionalism, 5)}`,
    `Communication: ${scale(record.communication, 5)}`,
    `Punctuality: ${scale(record.punctuality, 5)}`,
    `Care Of Items: ${scale(record.careOfItems, 5)}`,
    "",
    `Would Use Again: ${record.wouldUseAgain || "—"}`,
    "",
    "Positive Feedback:",
    record.positiveFeedback || "—",
    "",
    "Improvement Feedback:",
    record.improvementFeedback || "—",
    "",
    `Submission Date: ${when}`,
  ].join("\n");
}
