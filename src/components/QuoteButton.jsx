import Link from "next/link";

const variants = {
  primary:
    "bg-green text-white shadow-lg shadow-green/25 hover:bg-green/90",
  secondary: "border border-white/40 text-white hover:bg-white/10",
  navy: "bg-navy text-white transition-colors hover:bg-green",
  outline: "border border-navy/20 text-navy hover:bg-navy/5",
};

export default function QuoteButton({
  href = "/quote",
  variant = "primary",
  className = "",
  children,
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold transition ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
