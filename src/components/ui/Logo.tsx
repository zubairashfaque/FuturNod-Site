import React, { useState, type HTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LogoProps extends HTMLAttributes<HTMLImageElement> {}

export function Logo({ ...props }: LogoProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const logoUrl = "/assets/futur_nod_black_no_BG.png";

  const handleError = () => {
    console.error(
      "Failed to load logo. Please check if file exists at:",
      window.location.origin + logoUrl,
    );
    setImageError(true);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  if (imageError) {
    return <div style={{ fontSize: "32px" }}>Futur Nod</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: isLoaded ? 1 : 0,
          scale: isLoaded ? 1 : 0.95,
          y: isLoaded ? 0 : 10,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 },
        }}
      >
        <img
          src={logoUrl}
          alt="future nod logo"
          onError={handleError}
          onLoad={handleLoad}
          style={{
            height: "128px", // 200% increase from 64px (h-16)
            width: "auto",
            opacity: isLoaded ? 1 : 0,
          }}
          {...props}
        />
      </motion.div>
    </AnimatePresence>
  );
}
