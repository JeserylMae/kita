import { useState } from "react";


export function useCommunityTestimonyButton(
  testimonyItems: {}[],
  visibleCard: number
) {
  const [ startIndex, setStartIndex ] = useState(0);
  const [ slideDirection, setSlideDirection ] = useState<"left" | "right">("right");
  
  const progress = (startIndex + visibleCard) / testimonyItems.length * 100;
  const hasNext = !(testimonyItems.length - startIndex <= visibleCard);
  const hasPrev = startIndex > 0;
  
  const nextSlide = () => {
    setSlideDirection('right');

    setStartIndex((prev) =>
      prev + visibleCard >= testimonyItems.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setSlideDirection('left');

    setStartIndex((prev) =>
      prev === 0 ? testimonyItems.length - visibleCard : prev - 1
    );
  };

  return { 
    progress,
    hasNext,
    hasPrev, 
    startIndex,
    slideDirection, 
    nextSlide, 
    prevSlide 
  };
}