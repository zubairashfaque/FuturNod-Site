import React, { ReactNode } from "react";
import { motion, MotionProps } from "framer-motion";
import { fadeIn, pulseAnimation, buttonHover } from "../../lib/motion";

type AnimationType = "fadeIn" | "pulse" | "hover";
type Direction = "up" | "down" | "left" | "right";

interface AnimatedElementProps {
  children: ReactNode;
  animation: AnimationType;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  onClick?: () => void;
  motionProps?: MotionProps;
}

export const AnimatedElement = ({
  children,
  animation,
  direction = "up",
  delay = 0,
  duration = 1,
  className = "",
  as: Component = "div",
  onClick,
  motionProps = {},
}: AnimatedElementProps) => {
  let animationProps: MotionProps = {};

  switch (animation) {
    case "fadeIn":
      animationProps = {
        initial: "hidden",
        whileInView: "show",
        viewport: { once: true },
        variants: fadeIn(direction, delay),
      };
      break;
    case "pulse":
      animationProps = {
        ...pulseAnimation,
        transition: { ...pulseAnimation.transition, duration },
      };
      break;
    case "hover":
      animationProps = buttonHover;
      break;
  }

  return (
    <motion.div
      {...animationProps}
      {...motionProps}
      className={className}
      onClick={onClick}
      as={Component}
    >
      {children}
    </motion.div>
  );
};
