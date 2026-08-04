"use client";

import {
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCommunityVisibleCard } from "../../hooks/useCommunityVisibleCard";
import { useCommunityTestimonyButton } from "../../hooks/useCommunityTestimonyButton";
import { useCommunityTestimonyScroll } from "../../hooks/useCommunityTestimonyScroll";


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
  const visibleCard = useCommunityVisibleCard();
  const { 
    progress,
    hasNext,
    hasPrev, 
    startIndex,
    slideDirection, 
    nextSlide, 
    prevSlide 
  } = useCommunityTestimonyButton(
    testimonyItems, 
    visibleCard
  );

  const { 
    scrollProgress, 
    containerRef 
  } = useCommunityTestimonyScroll();

  const currProgress = visibleCard === testimonyItems.length 
    ? scrollProgress : progress;

  const animationDirection = slideDirection === "right" 
    ? "slide-in-from-right" 
    : "slide-in-from-left";


  return (
    <div className={cn(
      "w-9/10 lg:w-8/10 h-max gap-10 mt-2 mx-auto box-border",
      "flex flex-row justify-center items-center relative"  
    )}>
      <div className={buttonStyle}>
        <Button variant={"secondary"} 
          onClick={prevSlide}
          disabled={!hasPrev}> 
            <ChevronLeft/> 
        </Button>
      </div>
      
      <div ref={containerRef} className={cn(
        "flex flex-col justify-start sm:justify-center shrink-0",
        "w-68 md:w-max h-74 lg:h-94 overflow-y-hidden scrollbar-none",
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
                className={cn(gradientWrapper, animationDirection)}
              >
                <div key={`${startIndex}-${item.name}`} 
                  className={cn(testimonyStyle, animationDirection)}
                >
                  <div>
                    <p className="text-3xl"> " </p>
                    <p> {item.testimony} </p>
                  </div>

                  <div>
                    <p className="text-primary"><strong> {item.name} </strong></p>
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

      <Progress value={currProgress} className="absolute bottom-0 w-25"/>  
    </div>
  );
}