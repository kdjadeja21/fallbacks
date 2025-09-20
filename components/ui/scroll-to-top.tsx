"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ScrollToTopProps {
  /**
   * The scroll position threshold to show the button
   * @default 300
   */
  threshold?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether to use smooth scrolling animation
   * @default true
   */
  smooth?: boolean;
  /**
   * Button size variant
   * @default "default"
   */
  size?: "default" | "sm" | "lg" | "icon";
  /**
   * Button variant
   * @default "default"
   */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function ScrollToTop({
  threshold = 300,
  className,
  smooth = true,
  size = "icon",
  variant = "outline",
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled beyond threshold
      if (window.pageYOffset > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Listen for scroll events
    window.addEventListener("scroll", toggleVisibility);

    // Clean up the event listener
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    if (smooth) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-8 right-8 z-50 transition-opacity duration-200",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none",
        className
      )}
    >
      <Button
        onClick={scrollToTop}
        size={size}
        variant={variant}
        className="cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-200"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  );
}