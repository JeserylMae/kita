"use client";

import {
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";


const buttonStyle = "hidden sm:block"

const gradientWrapper = (`
  flex flex-col justify-center items-center
  rounded-2xl bg-primary-gradient-hr 
  w-62 lg:w-[18.5rem] h-64 lg:h-82 
  animate-in fade-in duration-1500
`);

const testimonyStyle = (`
  col-span-1 flex flex-col justify-between shrink-0 
  w-60 lg:w-[18rem] h-62 lg:h-80 py-4 px-6
  rounded-2xl bg-background text-sm lg:text-lg
  hover:bg-transparent hover:text-primary-foreground hover:font-medium
  hover:transition-color hover:duration-200 hover:ease-in
  animate-in fade-in duration-1500
`);

const testimonyItems = [
  {
    name: "Anna Delgado",
    role: "Store Owner",
    city: "Davao",
    testimony: (`Kita changed the way we handle our stock. 
      What used to take hours now takes minutes — and 
      we finally know which products actually make us money.`),
  }, {
    name: "Ralph Mendoza",
    role: "Retail Manager",
    city: "Manila",
    testimony: (`We connected our POS and online shop in one 
      dashboard. Kita gave us control we never had before.`),
  }, {
    name: "Jessica Tan",
    role: "Café Owner",
    city: "Cebu",
    testimony: (`I love how simple it looks but how powerful it is. 
      Kita helped us avoid overstock for the first time in years.`),
  }, {
    name: "Maria Lopez",
    role: "Store Manager",
    city: "Batangas",
    testimony: (`Kita has completely transformed how we manage our 
      inventory. We no longer worry about stockouts or overstock — 
      everything is clear and easy to track.`),
  }, {
    name: "James Tan",
    role: "Owner",
    city: "Cavite",
    testimony: (`The insights from Kita are a game-changer. I can 
      make data-driven decisions instantly, and our profits have 
      noticeably improved!`),
  }, 
];

export default function Testimony() {
  const [ hasNext, setHasNext ] = useState(true);
  const [ hasPrev, setHasPrev ] = useState(false);
  const [ progress, setProgress ] = useState(0)
  const [ startIndex, setStartIndex ] = useState(0);
  const [ visibleCard, setVisibleCard ] = useState(3);
  const [ slideDirection, setSlideDirection ] = useState<"left" | "right">("right");
    
  useEffect(() => {
    const handleResize = () => {
      const isXL = window.matchMedia("(min-width: 1280px)").matches;
      const isMD = window.matchMedia("(min-width: 768px)").matches;

      if (isXL) return setVisibleCard(3);
      if (isMD) return setVisibleCard(2);
      
      return setVisibleCard(5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const nextSlide = () => {
    setSlideDirection('right');

    if (testimonyItems.length - ( startIndex + 1) <= visibleCard) {
      setHasNext(false);
    }

    setHasPrev(true);
    setStartIndex((prev) =>
      prev + visibleCard >= testimonyItems.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setSlideDirection('left');

    if (startIndex - 1 <= 0) {
      setHasPrev(false);
    }
    setHasNext(true);

    setStartIndex((prev) =>
      prev === 0 ? testimonyItems.length - visibleCard : prev - 1
    );
  };

  return (
    <div className={cn(
      "w-9/10 lg:w-8/10 h-max gap-10 mt-2 mx-auto box-border",
      "flex flex-row justify-center items-center"  
    )}>
      <div className={buttonStyle}>
        <Button variant={"secondary"} 
          onClick={prevSlide}
          disabled={!hasPrev}> 
            <ChevronLeft/> 
        </Button>
      </div>
      
      <div className={cn(
        "flex flex-row justify-start sm:justify-center shrink-0",
        "w-68 md:w-max h-72 lg:h-88 overflow-y-hidden scrollbar-none",
        "overflow-x-scroll sm:overflow-x-hidden px-2 sm:px-6 py-4 sm:p-4"
      )}>
        <div className={cn(
          "w-max h-max shrink-0 grid gap-8 box-border",
          "grid-cols-5 md:grid-cols-2 xl:grid-cols-3"
        )}>
          {testimonyItems
            .slice(startIndex, startIndex + visibleCard)
            .map((item) => (
              <div key={`${startIndex}-${item.name}-wr`} 
                className={cn(
                  gradientWrapper,
                  slideDirection === "right"
                    ? "slide-in-from-right"
                    : "slide-in-from-left"
              )}>
                <div key={`${startIndex}-${item.name}`} 
                  className={cn(
                    testimonyStyle,
                    slideDirection === "right"
                      ? "slide-in-from-right"
                      : "slide-in-from-left"
                  )}>
                  <div>
                    <p className="text-3xl"> " </p>
                    <p> {item.testimony} </p>
                  </div>

                  <div>
                    <p><strong> {item.name} </strong></p>
                    <p> {item.role}, {item.city} </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>     
      </div>

      <div className={buttonStyle}>
        <Button variant={"secondary"} 
          onClick={nextSlide} 
          disabled={!hasNext}> 
            <ChevronRight/> 
        </Button>
      </div>
    </div>
  );
}