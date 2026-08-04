"use client";

import { useState, useEffect, useRef } from "react";


export function useCommunityTestimonyScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const maxScroll =
        container.scrollWidth - container.clientWidth;

      if (maxScroll === 0) {
        setScrollProgress(100);
        return;
      }

      setScrollProgress((container.scrollLeft / maxScroll) * 100);
    };

    container.addEventListener("scroll", handleScroll);

    handleScroll(); // initialize

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return { scrollProgress, containerRef };
}