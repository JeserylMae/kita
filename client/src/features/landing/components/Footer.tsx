import { cn } from "@/lib/utils";
import Image from "next/image";
import Section from "@/components/layout/Section";


export default function Footer() {
  return (
    <Section className={cn(
      "flex flex-row justify-center items-center",
      "p-15 pt-16! bg-primary text-primary-foreground"
    )}>
      <div className="w-full flex flex-col gap-0 justify-start items-center">
        <div className="relative w-10 h-10">
          <Image
            src={"/Kita-dark.svg"}
            alt="Kita Icon"
            fill
            sizes="100%"
            className="object-contain"
          />
        </div>

        <h1 className="text-3xl uppercase font-heading font-semibold">
          Kita
        </h1>
        <p className="font-medium">
          Know Your Stock Better
        </p>
      
        <p className={cn(
          "w-9.5/10 sm:w-9/10 pt-1 mt-10 border-t",
          "text-center text-(--color-old-gold-300)"
        )}>
          Take control of your inventory today. With Kita, smarter 
          decisions and greater profits are just a click away.
        </p>
      </div>
    </Section>
  );
}