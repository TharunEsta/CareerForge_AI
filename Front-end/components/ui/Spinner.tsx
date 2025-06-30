import { motion } from "framer-motion";

export default function Spinner({ size = 24, className = "" }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-label="Loading"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="#2563eb"
        strokeWidth="4"
        strokeDasharray="60 40"
        strokeLinecap="round"
        fill="none"
      />
    </motion.svg>
  );
} 