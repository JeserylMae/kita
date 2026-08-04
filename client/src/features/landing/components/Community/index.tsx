import { cn } from "@/lib/utils";
import Section from "@/components/layout/Section";
import Testimony from "./Testimony";
import Statistics from "./Statistics";


export default function Community() {
  return (
    <Section id="community">
      <div className="w-full px-6 flex flex-col justify-center items-center gap-4">
        <h2 className="gradient-text-hr text-center">Community That Grows Together</h2>
        <p className="text-center">Join thousands of business owners who see — and profit — more clearly with Kita.</p>
      </div>

      <h3 className="font-semibold text-2xl text-center capitalize mt-16">
        Trusted by stores everywhere
      </h3>
      <div> <Testimony/> </div>

      <section className={cn(
        "w-full px-6 py-32 flex flex-col justify-center items-center",
        "text-center gap-4"
      )}>
        <h2 className="gradient-text-hr">Number You Can Trust</h2>
        <p className="w-9.5/10 xl:w-3/4 2xl:w-1/2">
          With millions of products tracked and thousands of businesses supported, 
          Kita is a reliable partner for modern inventory management.
        </p>

        <Statistics/>
      </section>
    </Section>
  );
}