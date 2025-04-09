import { motion } from "framer-motion";

export function RedDot() {
  return (
    <motion.div
      className="absolute h-2 w-2 bg-[#ff3131] rounded-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    />
  );
}
