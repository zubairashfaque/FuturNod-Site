import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroProps {
  onContactClick: () => void;
}

const Hero = ({ onContactClick = () => {} }: HeroProps) => {
  const phrases = [
    "Growth",
    "Customer Support",
    "Web Scraping",
    "Lead Generation",
    "CRM Management",
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <section className="w-full py-32 px-4 md:px-8 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
              We Build
            </h1>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
              AI Automations
            </h1>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold h-24 md:h-28 lg:h-32">
              For{" "}
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentPhraseIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-gray-300 inline-block"
                >
                  {phrases[currentPhraseIndex]}
                </motion.span>
              </AnimatePresence>
              <div className="relative inline-block ml-1 h-4 w-4">
                <motion.div
                  className="absolute h-4 w-4 bg-white border-2 border-[#ff3131] rounded-full"
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
                  className="absolute h-2 w-2 bg-[#ff3131] rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 0.8, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </h1>
          </div>

          <div className="py-4">
            <p className="text-lg">
              <span className="text-[#ff3131] font-bold">NODDING</span> to the{" "}
              <span className="text-[#ff3131] font-bold">FUTURE</span> - We
              transform businesses through innovative AI solutions, creating
              seamless experiences that define tomorrow's technology.
            </p>
          </div>

          <div className="pt-4">
            <Button
              onClick={onContactClick}
              className="bg-black hover:bg-gray-800 text-white rounded-md px-6 py-3 text-base flex items-center gap-2 group"
            >
              <span>Let's talk</span>
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                <Phone className="h-4 w-4 text-black" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
