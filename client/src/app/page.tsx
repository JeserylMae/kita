import "./globals.css";
import Hero from "@/features/landing/components/Hero";
import Image from "next/image";
import NavBar from "@/features/landing/components/NavBar";
import Section from "@/components/layout/Section";
import Solutions from "@/features/landing/components/Solutions";
import Community from "@/features/landing/components/Community";
import WhyChooseUs from "@/features/landing/components/WhyChooseUs";


export default function Home() {
  return (
    <div className="flex flex-col justify-start items-center">
      <NavBar/>
      <Hero/>

      <Section>
        <div className="w-full sm:w-3/4 sm:bg-primary-gradient-hr sm:p-4 sm:rounded-4xl mx-auto">
          <div className="relative w-full h-200 sm:rounded-4xl">
            <Image
              src={"/landing/inventory.png"}
              alt="Inventory Image"
              fill
              className="rounded-3xl object-cover"
            />
          </div>
        </div>
      </Section>

      <WhyChooseUs/>
      <Solutions/>
      <Community/>
    </div>
  );
}
