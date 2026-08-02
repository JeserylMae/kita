import "./globals.css";
import Image from "next/image";
import NavBar from "@/components/landing/NavBar";
import Hero from "@/components/landing/Hero";
import WhyChooseUs from "@/components/landing/WhyChooseUs";


export default function Home() {
  return (
    <div className="flex flex-col gap-32 justify-start items-center">
      <div className="flex flex-col gap-32">
        <NavBar/>
        <Hero/>
      </div>

      <section className="w-3/4 bg-primary-gradient p-4 rounded-4xl">
        <div className="relative w-full h-200 rounded-4xl">
          <Image
            src={"/landing-inventory.png"}
            alt="Inventory Image"
            fill
            className="rounded-3xl object-cover"
          />
        </div>
      </section>

      <WhyChooseUs/>
    </div>
  );
}
