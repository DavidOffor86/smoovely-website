/* ---------------------------------------------------------------------------
 * Careers application record + email builders (pure — no framework/network).
 *
 * Turns a submitted careers application into:
 *   - a FLAT record for Power Automate / Excel / CRM (one key = one column)
 *   - an applicant acknowledgement email ("we've received your application")
 *   - an internal notification email (with the CV attached by the route)
 *
 * Kept separate from the quote/feedback/operations pipelines.
 * ------------------------------------------------------------------------- */

/** Default internal recipient when NOTIFY_EMAIL is not configured. */
export const CAREERS_TO = "support@smoovelylogistics.com";

/** Flat record — every key maps 1:1 to a column. */
export function buildCareersRecord({ application = {}, cv = null, timestamp }) {
  return {
    timestamp,
    type: "careers-application",

    name: (application.name || "").trim(),
    email: (application.email || "").trim(),
    phone: (application.phone || "").trim(),
    role: application.role || "",

    cvProvided: !!cv,
    cvFilename: cv?.filename || "",

    source: "careers-page",
  };
}

/** Acknowledgement email sent TO the applicant. */
export function buildApplicantAckEmail(record) {
  const name = record.name || "there";
  const role = record.role ? ` for the ${record.role} role` : "";
  const cvLine = record.cvProvided
    ? "We've received your details and CV"
    : "We've received your details";
  return [
    `Hi ${name},`,
    "",
    `Thank you for applying to Smoovely Logistics${role}. ${cvLine} and a`,
    "member of our team will review your application and be in touch if there's",
    "a suitable opportunity.",
    "",
    "We appreciate your interest in joining the team.",
    "",
    "Best wishes,",
    "The Smoovely Team",
  ].join("\n");
}

/** Internal notification email (CV attached by the route when present). */
export function buildCareersNotifyEmail(record) {
  const val = (v) => (v === "" || v == null ? "—" : v);
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
    "New careers application",
    "",
    `Name:   ${val(record.name)}`,
    `Email:  ${val(record.email)}`,
    `Phone:  ${val(record.phone)}`,
    `Role:   ${val(record.role)}`,
    `CV:     ${record.cvProvided ? record.cvFilename : "Not provided"}`,
    "",
    `Submitted: ${when}`,
  ].join("\n");
}
