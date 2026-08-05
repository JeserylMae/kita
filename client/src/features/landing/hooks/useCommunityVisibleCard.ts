"use client";

import { useState, useEffect } from "react";

export function useCommunityVisibleCard() {
  const [ visibleCard, setVisibleCard ] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      const isXL = window.matchMedia("(min-width: 1280px)").matches;
      const isMD = window.matchMedia("(min-width: 768px)").matches;
      const isSM = window.matchMedia("(min-width: 640px)").matches;

      if (isXL) return setVisibleCard(3);
      if (isMD) return setVisibleCard(2);
      if (isSM) return setVisibleCard(1);
      
      return setVisibleCard(5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return visibleCard;
} 