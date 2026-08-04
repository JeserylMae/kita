import Section from "@/components/layout/Section";
import Testimony from "./Testimony";

export default function Community() {
  return (
    <Section>
      <div className="w-full px-6 flex flex-col justify-center items-center gap-4">
        <h2 className="gradient-text-hr text-center">Community That Grows Together</h2>
        <p className="text-center">Join thousands of business owners who see — and profit — more clearly with Kita.</p>
      </div>

      <h3 className="font-semibold text-2xl text-center capitalize mt-16">Trusted by stores everywhere</h3>
      <div> <Testimony/> </div>
    </Section>
  );
}