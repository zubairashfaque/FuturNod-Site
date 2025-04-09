import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone } from "lucide-react";
import { fadeIn, buttonHover, pulseAnimation } from "../lib/motion";
import { ContactDialog } from "./ContactDialog";
import { Loading } from "./ui/loading";
import { AnimatedElement } from "./ui/animated-element";

interface HeroProps {
  onContactClick?: () => void;
}

const DYNAMIC_WORDS = [
  "Growth",
  "CRM Management",
  "Web Scraping",
  "Customer Support",
  "Lead Generation",
  "Process Automation",
];

const pathVariants = {
  hidden: { pathLength: 0, opacity: 1 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.5, ease: "easeInOut" },
  },
};

function HandDrawnUnderline({
  width,
  offsetX,
}: {
  width: number;
  offsetX?: number;
}) {
  return (
    <svg
      viewBox={`0 0 ${width} 40`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute bottom-[-6px] h-[14px]"
      style={{ width, left: offsetX || 0 }}
    >
      <motion.path
        d={`M3 20 C${width * 0.25} 30, ${width * 0.5} 10, ${width * 0.75} 25, ${width - 5} 10`}
        stroke="#ff3131"
        strokeWidth="6"
        fill="transparent"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </svg>
  );
}

const Hero = ({ onContactClick }: HeroProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % DYNAMIC_WORDS.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleContactClick = () => {
    if (onContactClick) {
      onContactClick();
    } else {
      setDialogOpen(true);
    }
  };

  return (
    <section className="min-h-screen flex items-center pt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatedElement
            animation="fadeIn"
            direction="up"
            delay={0.3}
            className="space-y-8"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              <AnimatedElement
                animation="fadeIn"
                direction="left"
                delay={0.5}
                as="span"
                className="inline-block"
              >
                We Build
              </AnimatedElement>
              <br />
              <AnimatedElement
                animation="fadeIn"
                direction="right"
                delay={0.7}
                as="span"
                className="inline-block"
              >
                AI Automations
              </AnimatedElement>
              <br />
              <AnimatedElement
                animation="fadeIn"
                direction="left"
                delay={0.9}
                as="span"
                className="inline-block"
              >
                For{" "}
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="inline-flex items-center gap-2 text-gray-500"
                  >
                    {DYNAMIC_WORDS[wordIndex]}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="ml-2"
                    >
                      <Loading size="sm" />
                    </motion.div>
                  </motion.span>
                </AnimatePresence>
              </AnimatedElement>
            </h1>

            <AnimatedElement
              animation="fadeIn"
              direction="up"
              delay={1.1}
              className="text-xl"
              as="p"
            >
              <AnimatedElement
                animation="pulse"
                duration={3}
                as="span"
                className="relative inline-block text-[#ff3131] font-bold"
              >
                NODDING
                <HandDrawnUnderline width={210} offsetX={-68} />
              </AnimatedElement>{" "}
              <span className="text-black">to the</span>{" "}
              <AnimatedElement
                animation="pulse"
                duration={3}
                as="span"
                className="relative inline-block text-[#ff3131] font-bold"
              >
                FUTURE
                <HandDrawnUnderline width={155} offsetX={-50} />
              </AnimatedElement>{" "}
              - We transform businesses through innovative AI solutions,
              creating seamless experiences that define tomorrow's technology.
            </AnimatedElement>

            <div className="relative inline-flex items-center">
              <AnimatedElement
                animation="hover"
                as="button"
                className="bg-black text-white text-lg font-medium px-6 py-4 rounded-lg w-full max-w-[220px] flex justify-between items-center relative z-10"
                onClick={handleContactClick}
                duration={0.2}
              >
                <span>Let's talk</span>
                <span className="w-[64px]" />
              </AnimatedElement>

              <AnimatedElement
                animation="hover"
                as="button"
                className="absolute right-0 w-[52px] h-[52px] bg-white hover:bg-gray-50 flex items-center justify-center rounded-lg shadow-md z-20 translate-x-[-16px] border border-gray-200"
                onClick={handleContactClick}
                motionProps={{
                  whileHover: {
                    boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
                    backgroundColor: "rgb(249 250 251)",
                  },
                }}
              >
                <Phone className="w-5 h-5 text-black" />
              </AnimatedElement>
            </div>
          </AnimatedElement>
        </div>
      </div>

      <ContactDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </section>
  );
};

export default Hero;
