"use client";

import { motion } from "framer-motion";

/**
 * Fades + slides its children in once when scrolled into view.
 * Wrap full-width sections with this for an on-scroll reveal.
 */
export default function Reveal({ children, delay = 0, y = 28, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
