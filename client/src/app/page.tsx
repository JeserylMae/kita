import "./globals.css";
import Hero from "@/components/landing/Hero";
import Image from "next/image";
import NavBar from "@/components/landing/NavBar";
import Section from "@/components/layout/Section";
import Solutions from "@/components/landing/Solutions";
import Community from "@/components/landing/Community";
import WhyChooseUs from "@/components/landing/WhyChooseUs";


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
