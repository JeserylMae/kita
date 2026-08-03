import "./globals.css";
import Image from "next/image";
import NavBar from "@/components/landing/NavBar";
import Hero from "@/components/landing/Hero";
import Solutions from "@/components/landing/Solutions";
import WhyChooseUs from "@/components/landing/WhyChooseUs";


export default function Home() {
  return (
    <div className="flex flex-col justify-start items-center gap-20 md:gap-32">
      <NavBar/>
      <Hero/>

      <section className="w-full sm:w-3/4 sm:bg-primary-gradient-hr sm:p-4 sm:rounded-4xl">
        <div className="relative w-full h-200 sm:rounded-4xl">
          <Image
            src={"/landing/inventory.png"}
            alt="Inventory Image"
            fill
            className="rounded-3xl object-cover"
          />
        </div>
      </section>

      <WhyChooseUs/>
      <Solutions/>
    </div>
  );
}
