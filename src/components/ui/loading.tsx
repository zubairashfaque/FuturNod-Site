import React from "react";
import { motion } from "framer-motion";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  color?: string;
}

export const Loading = ({ size = "md", color = "#ff3131" }: LoadingProps) => {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className={`relative ${sizeMap[size]}`}>
      <motion.div
        className="absolute h-full w-full bg-white border-2 rounded-full"
        style={{ borderColor: color }}
        initial={{ y: 0, x: "50%" }}
        animate={{
          y: ["0%", "100%", "0%"],
          x: "50%",
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute h-1/2 w-1/2 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: color }}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 0.8, 1] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};
