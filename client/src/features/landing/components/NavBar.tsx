"use client"

import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";


const listItem = "text-center"

export default function NavBar() {
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    document.body.style.overflow = display ? "hidden" : "auto";
    
    return () => { document.body.style.overflow = "auto"; };
  }, [display]);

  return (
    <section className="fixed w-full top-0 z-10 bg-background border-b border-border">
      <div className="absolute top-3 left-0 block md:hidden">
        <Button size={"icon-lg"} width={"lg"} variant={"ghost"}
          onClick={() => setDisplay(prev => !prev)}
        >
          <Menu/>
        </Button>
      </div>
  
      <nav className={cn(
        "pt-10 md:pt-0",
        display ? "block" : "hidden md:block"
      )}>
        <ul className={cn(
          "h-[95vh] md:h-max",
          "flex flex-col gap-2 justify-start items-start p-4",
          "md:flex-row md:gap-8 md:justify-center md:items-center lg:gap-16"
        )}>
          <li className={listItem}><a href="#why-choose-us"> Why choose us </a></li>
          <li className={listItem}><a href="#solutions"> Solutions </a></li>
          <li className={listItem}><a href="#features"> Features </a></li>

          <li><a href="#hero" className="hidden md:flex"> 
            <Image
              src="/Kita.svg"
              alt="Kita Logo"
              width={35}
              height={36}
            />
          </a></li>

          <li className={listItem}><a href="#community"> Community </a></li>
          <li className={listItem}><a href="#request-demo"> Request Demo </a></li>
          
          <div className="w-full md:w-max mt-auto md:mt-0">
            <Button size={"sm"} asChild>
              <Link href={"/signin"} className="w-full md:w-max"> Sign In </Link>
            </Button>
          </div>
        </ul>
      </nav>
    </section>
  );
}