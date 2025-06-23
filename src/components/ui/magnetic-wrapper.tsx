"use client";

import React, { useEffect, useRef, RefObject } from "react";
import gsap from "gsap";

interface MagneticWrapperProps {
  children: React.ReactElement;
  animationDuration?: number;
  elasticity?: number;
}

interface MagneticElement extends HTMLElement {
  getBoundingClientRect(): DOMRect;
}

export default function MagneticWrapper({
  children,
  animationDuration = 1,
  elasticity = 0.3,
}: MagneticWrapperProps) {
  const magneticElementRef = useRef<MagneticElement | null>(null);

  useEffect(() => {
    const targetElement = magneticElementRef.current;
    if (!targetElement) {
      console.warn("MagneticWrapper: No target element found");
      return;
    }
    const animateXPosition = gsap.quickTo(targetElement, "x", {
      duration: animationDuration,
      ease: `elastic.out(1, ${elasticity})`,
    });
    const animateYPosition = gsap.quickTo(targetElement, "y", {
      duration: animationDuration,
      ease: `elastic.out(1, ${elasticity})`,
    });

    const handleMouseMove = (event: MouseEvent) => {
      try {
        const { clientX, clientY } = event;
        const elementBounds = targetElement.getBoundingClientRect();
        const elementCenterX = elementBounds.left + elementBounds.width / 2;
        const elementCenterY = elementBounds.top + elementBounds.height / 2;

        const distanceX = clientX - elementCenterX;
        const distanceY = clientY - elementCenterY;

        animateXPosition(distanceX);
        animateYPosition(distanceY);
      } catch (error) {
        console.error(
          "MagneticWrapper: Error during mouse move animation",
          error
        );
        resetPosition();
      }
    };

    const resetPosition = () => {
      try {
        animateXPosition(0);
        animateYPosition(0);
      } catch (error) {
        console.error("MagneticWrapper: Error resetting position", error);
      }
    };

    targetElement.addEventListener("mousemove", handleMouseMove);
    targetElement.addEventListener("mouseleave", resetPosition);

    return () => {
      targetElement.removeEventListener("mousemove", handleMouseMove);
      targetElement.removeEventListener("mouseleave", resetPosition);
    };
  }, [animationDuration, elasticity]);

  return React.cloneElement(children, {
    ref: magneticElementRef as RefObject<HTMLElement>,
  });
}
