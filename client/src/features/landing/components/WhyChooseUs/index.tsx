import Section from "@/components/layout/Section";
import FeatureGrid from "./FeatureGrid";
import FeatureList from "./FeatureIList";
import FeatureCarousel from "./FeatureCarousel";

export default function WhyChooseUs() {
  return (
    <Section id="why-choose-us" 
      className="w-full overflow-hidden flex flex-col gap-32"
    >
      <section className="flex w-max animate-carousel-slide">
        <div className="flex gap-10 pr-10">
          <FeatureCarousel />
        </div>

        <div aria-hidden="true" className="flex gap-10 pr-10">
          <FeatureCarousel />
        </div>
      </section>

      <section className="
        px-10 2xl:px-35 flex flex-col lg:flex-row gap-10 xl:gap-20
      ">
        <div className="w-full lg:w-2/5 flex flex-col gap-8">
          <h2 className="text-center lg:text-start">
            Transform {" "}
            <span className="text-primary">Chaos</span> {" "}
            Into {" "}
            <span className="text-tertiary">Clarity</span>
          </h2>

          <p className="text-center lg:text-start">
            Most businesses lose profit not because of poor sales — but because of
            unclear inventory. Kita helps you see exactly what's happening in your store, 
            so you can make faster, smarter, and more profitable decisions.
          </p>
        </div>

        <div className="flex-1">
          <FeatureList />
        </div>     
      </section>

      <section className="flex flex-col justify-center items-center gap-10">
        <h2 className="text-center">
          Built for {" "}
          <span className="gradient-text-vr 
            [-webkit-text-stroke:1px_theme(--color-foreground)]
          ">
            Smarter
          </span> {" "}
          Stores
        </h2>

        <FeatureGrid />
      </section>
    </Section>
  );
}