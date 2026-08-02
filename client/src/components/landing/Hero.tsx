import Link from "next/link";
import { Button } from "@/components/ui/button";


export default function Hero() {
  return (
    <section id="hero" className="
      flex flex-col gap-10 justify-center items-center m-4
    ">
      <h1 className="
        font-heading font-medium text-center max-w-6xl
        text-7xl md:text-8xl lg:text-9xl 
      ">
        <span className="text-primary"> Profit </span>
        Begins With A Clearer
        <span className="text-tertiary"> View</span>.
      </h1>

      <p className="text-center md:text-lg ld:text-xl mb-2">
        When you know what’s happening in your business, you can plan smarter and earn more. <br />
        Gain the insights you need to stay ahead, reduce waste, and make every decision count.
      </p>

      <Button variant={"gradient"} size={"xl"} width={"xl"} asChild>
        <Link href={"/signup"}> Get Started </Link>
      </Button>
    </section>
  )
}