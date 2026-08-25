/* ---------------------------------------------------------------------------
 * Customer Journey & Operations Platform record builders (Phase E).
 * Pure — no framework/network deps, unit-testable.
 *
 * Turns booking-acceptance, pre-move-checklist and move-completion submissions
 * into FLAT records for Power Automate / the future "Operations" Microsoft List
 * / Excel / CRM, plus a formatted notification email.
 *
 * NO pricing or quote logic here. Security metadata (IP, browser, timestamp,
 * terms version) is stamped server-side in /api/operations and passed in via
 * `meta` so it cannot be spoofed by the client payload.
 * ------------------------------------------------------------------------- */

/** Terms & Conditions version bound to each acceptance record. */
export const TERMS_VERSION = "v1.0 (2026-07)";

/** Power Automate event names — sent as `event` on each forwarded record. */
export const OPERATIONS_EVENTS = {
  BOOKING_ACCEPTED: "Booking Accepted",
  SIGNATURE_CAPTURED: "Signature Captured",
  CHECKLIST_COMPLETED: "Checklist Completed",
  MOVE_PACK_VIEWED: "Move Pack Viewed",
  MOVE_COMPLETED: "Move Completed",
  COMPLETION_SIGNED: "Completion Signed",
  FEEDBACK_REQUESTED: "Feedback Requested",
  REVIEW_REQUESTED: "Review Requested",
  WHATS_NEXT_SENT: "What's Next Sent",
};

/** Reusable end-to-end customer journey stages (Feature 11 timeline). */
export const JOURNEY_STAGES = [
  "Quote",
  "Acceptance",
  "Move Pack",
  "Checklist",
  "Move Day",
  "Completion",
  "Feedback",
  "Review",
  "What's Next",
];

/** Pre-move checklist questions (Feature 3). */
export const CHECKLIST_QUESTIONS = [
  { key: "fragilePacked", label: "Packed fragile items?" },
  { key: "parkingArranged", label: "Parking arranged?" },
  { key: "keysAvailable", label: "Keys available?" },
  { key: "accessKnown", label: "Access restrictions known?" },
  { key: "liftBooking", label: "Lift booking required?" },
];

/** Operations notes fields (Feature 5). */
export const OPERATIONS_NOTES_FIELDS = [
  { key: "parkingInstructions", label: "Parking Instructions" },
  { key: "accessRestrictions", label: "Access Restrictions" },
  { key: "liftInformation", label: "Lift Information" },
  { key: "buildingContact", label: "Building Contact" },
  { key: "accessCodes", label: "Access Codes" },
  { key: "specialInstructions", label: "Special Instructions" },
];

/**
 * Move Readiness score (Feature 4) — completion-based: the proportion of
 * checklist questions that have been answered (Yes/No), 0–100.
 */
export function moveReadinessScore(responses = {}) {
  const total = CHECKLIST_QUESTIONS.length;
  if (total === 0) return 0;
  const answered = CHECKLIST_QUESTIONS.filter((q) => {
    const v = responses[q.key];
    return v === "Yes" || v === "No";
  }).length;
  return Math.round((answered / total) * 100);
}

// Combine operations-notes fields into one multiline string (List column).
function operationsNotesText(notes = {}) {
  return OPERATIONS_NOTES_FIELDS.map((f) =>
    notes[f.key] ? `${f.label}: ${String(notes[f.key]).trim()}` : null
  )
    .filter(Boolean)
    .join("\n");
}

const bool = (v) => v === true || v === "true" || v === "Yes";

/* ----- Booking acceptance (Features 1 & 2) --------------------------------- */
export function buildAcceptanceRecord({ data = {}, meta = {} }) {
  const acceptedQuotation = bool(data.acceptQuote);
  const acceptedTerms = bool(data.acceptTerms);
  return {
    type: "booking-acceptance",
    event: OPERATIONS_EVENTS.BOOKING_ACCEPTED,
    timestamp: meta.timestamp,

    quoteReference: (data.quoteReference || "").trim(),
    customerName: (data.customerName || "").trim(),
    moveDate: data.moveDate || "",

    accepted: acceptedQuotation && acceptedTerms,
    acceptedQuotation,
    acceptedTerms,
    acceptedDate: meta.timestamp,
    acceptedBy: (data.customerName || "").trim(),

    // Signature + security (server-authoritative).
    acceptedSignature: data.signature || "",
    acceptedIPAddress: meta.ip || "",
    acceptedBrowser: meta.browser || "",
    termsVersion: TERMS_VERSION,

    source: "accept-booking",
  };
}

/* ----- Pre-move checklist + readiness + operations notes (Features 3–5) ----- */
export function buildChecklistRecord({ data = {}, meta = {} }) {
  const responses = data.responses || {};
  const notes = data.notes || {};
  const record = {
    type: "pre-move-checklist",
    event: OPERATIONS_EVENTS.CHECKLIST_COMPLETED,
    timestamp: meta.timestamp,

    quoteReference: (data.quoteReference || "").trim(),

    moveReadinessScore: moveReadinessScore(responses),
    operationsNotes: operationsNotesText(notes),

    source: "pre-move-checklist",
  };
  // One column per checklist question (checklist_<key>) for reporting.
  for (const q of CHECKLIST_QUESTIONS) {
    record[`checklist_${q.key}`] = responses[q.key] || "";
  }
  return record;
}

/* ----- Move completion + signature + issue reporting (Features 8–10) -------- */
export function buildCompletionRecord({ data = {}, meta = {} }) {
  const completionStatus = data.completionStatus === "Yes" ? "Yes" : data.completionStatus === "No" ? "No" : "";
  const hasIssue = completionStatus === "No";
  const issueDetails = hasIssue
    ? [
        data.issueDescription && `Description: ${String(data.issueDescription).trim()}`,
        data.comments && `Comments: ${String(data.comments).trim()}`,
        data.photoUrl && `Photo: ${String(data.photoUrl).trim()}`,
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  return {
    type: "move-completion",
    event: OPERATIONS_EVENTS.MOVE_COMPLETED,
    timestamp: meta.timestamp,

    quoteReference: (data.quoteReference || "").trim(),

    completionStatus,
    completionDate: meta.timestamp,

    completionSignature: data.signature || "",
    completionSignedBy: (data.customerName || "").trim(),
    completionIPAddress: meta.ip || "",
    completionBrowser: meta.browser || "",

    issueStatus: hasIssue ? "Open" : "None",
    issueDetails,

    source: "move-completion",
  };
}

/**
 * Map any operations record to the future "Operations" Microsoft List columns
 * (the 16 spec fields). Absent fields default to "".
 */
export function toOperationsListItem(record = {}) {
  return {
    QuoteReference: record.quoteReference || "",
    Accepted: record.accepted == null ? "" : record.accepted ? "Yes" : "No",
    AcceptedDate: record.acceptedDate || "",
    AcceptedBy: record.acceptedBy || "",
    AcceptedSignature: record.acceptedSignature || "",
    AcceptedIPAddress: record.acceptedIPAddress || "",
    MoveReadinessScore:
      record.moveReadinessScore == null ? "" : record.moveReadinessScore,
    OperationsNotes: record.operationsNotes || "",
    MovePackSentDate: record.movePackSentDate || "",
    MovePackViewedDate: record.movePackViewedDate || "",
    CompletionStatus: record.completionStatus || "",
    CompletionDate: record.completionDate || "",
    CompletionSignature: record.completionSignature || "",
    CompletionSignedBy: record.completionSignedBy || "",
    IssueStatus: record.issueStatus || "",
    IssueDetails: record.issueDetails || "",
  };
}

/** Formatted plain-text notification email (never embeds the signature blob). */
export function buildOperationsEmailText(record = {}) {
  const val = (v) => (v === "" || v == null ? "—" : v);
  const sig = (v) => (v ? "Yes (captured)" : "No");
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

  if (record.type === "booking-acceptance") {
    return [
      `Booking accepted — ${val(record.quoteReference)}`,
      "",
      `Accepted By:        ${val(record.acceptedBy)}`,
      `Move Date:          ${val(record.moveDate)}`,
      `Quotation Accepted: ${record.acceptedQuotation ? "Yes" : "No"}`,
      `Terms Accepted:     ${record.acceptedTerms ? "Yes" : "No"}`,
      `Terms Version:      ${val(record.termsVersion)}`,
      `Signature:          ${sig(record.acceptedSignature)}`,
      `IP Address:         ${val(record.acceptedIPAddress)}`,
      `Browser:            ${val(record.acceptedBrowser)}`,
      `Accepted Date:      ${when}`,
    ].join("\n");
  }

  if (record.type === "pre-move-checklist") {
    const lines = CHECKLIST_QUESTIONS.map(
      (q) => `${q.label.padEnd(28)} ${val(record[`checklist_${q.key}`])}`
    );
    return [
      `Pre-move checklist completed — ${val(record.quoteReference)}`,
      "",
      `Move Readiness:     ${val(record.moveReadinessScore)}%`,
      "",
      ...lines,
      "",
      "Operations Notes:",
      val(record.operationsNotes),
      "",
      `Submitted:          ${when}`,
    ].join("\n");
  }

  if (record.type === "move-completion") {
    return [
      `Move completion — ${val(record.quoteReference)}  ·  ${
        record.completionStatus === "Yes" ? "All items received safely" : "Issue reported"
      }`,
      "",
      `Completion Status:  ${val(record.completionStatus)}`,
      `Signed By:          ${val(record.completionSignedBy)}`,
      `Signature:          ${sig(record.completionSignature)}`,
      `IP Address:         ${val(record.completionIPAddress)}`,
      `Browser:            ${val(record.completionBrowser)}`,
      `Issue Status:       ${val(record.issueStatus)}`,
      "",
      "Issue Details:",
      val(record.issueDetails),
      "",
      `Completed Date:     ${when}`,
    ].join("\n");
  }

  return `Operations event: ${val(record.event)} (${val(record.type)}) — ${when}`;
}
