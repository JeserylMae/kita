import {
  Clock,
  Cloud,
  CreditCard,
  Earth,
  Handshake
} from 'lucide-react';

import { cn } from "@/lib/utils";
import Image from "next/image";
import Section from '../../../components/layout/Section';



const heading3 = "font-semibold text-2xl text-center capitalize";
const outlinedCell = (`
  bg-background gap-5 p-4
  col-span-1 flex flex-col justify-center items-center relative rounded-2xl
  before:absolute before:-inset-1 before:bg-primary-gradient-hr before:-z-1
  before:rounded-2xl
`);

const listItems = [
  {
    icon: Clock,
    text: "Save hours every week"
  }, {
    icon: Cloud,
    text: "Know what's happening anytime"
  }, {
    icon: CreditCard,
    text: "Turn stock into profit"
  }, {
    icon: Earth,
    text: "Manage multiple stores effortlessly"
  }, {
    icon: Handshake,
    text: "Empower your whole team"
  }, 
];

function SolutionList() {
  return (
    <div className='w-9.5/10 sm:w-3/4 lg:w-200'>
      {listItems.map(({icon: Icon, text}, index) => (
        <div key={index} className={cn(
          "flex flex-row w-full justify-between items-center py-5 px-6",
          "border-b-2 border-tertiary-1 text-center text-sm sm:text-[1.1rem]",
          "hover:bg-tertiary-1 hover:text-foreground",
          "transition-colors duration-400 ease-in"
        )}>
          <Icon/> <p>{text}</p> <Icon/>
        </div>
      ))}
    </div>
  );
}

export default function Solutions() {
  return (
    <Section id="solutions" className="w-full border-box">
      <div className={cn(
        "w-full sm:w-9/10 mx-auto px-10 2xl:px-32 pt-32 pb-48",
        "sm:border sm:border-b-0 border-border rounded-2xl"
      )}>
        <h2 className="mb-32 sm:mb-8 text-center sm:text-start">
          <span className="text-primary">Fix</span> {" "}
          What {" "}
          <span className="text-tertiary">Slows</span> {" "}
          Your Stock Down 
        </h2>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className={cn(
            "col-span-1 sm:col-span-2 flex flex-row gap-x-2 py-6 px-8",
            "bg-primary-gradient-hr rounded-2xl"
          )}>
            <div className="flex flex-col justify-center sm:justify-between flex-1">
              <h3 className={cn(heading3, "mt-4 text-start text-primary-foreground")}>
                Keep Everything in Sync
              </h3>
              <p className="w-[90%] text-primary-foreground font-medium hidden sm:block">
                Connect you POS, e-commerce, and accounting tools so your business runs as one system.
              </p>
            </div>

            <div className="relative w-24 h-36 lg:w-29 lg:h-44">
              <Image 
                src={"/landing/solution.png"}
                alt="Data secured online."
                fill
                sizes="100%"
                className="object-cover"
              />
            </div>
          </div>

          <div className={outlinedCell}>
            <h3 className={heading3}>Stop losing profit to stock mistakes</h3>
            <p className="text-center">Detect stock or low-stock items early to avoid waste and missed sales.</p>
          </div>

          <div className={outlinedCell}>
            <h3 className={heading3}>Eliminate manual work</h3>
            <p className="text-center">Say goodbye to spreadsheets — Kita automates tracking, updates, and reporting in real time.</p>
          </div>
        </section>
      </div>

      <div className={cn(
        "py-24 px-10 xl:px-32 gap-4 text-center",
        "flex flex-col justify-center items-center",
        "bg-primary text-primary-foreground font-medium"
      )}>
        <h2>
          <span className="text-tertiary [-webkit-text-stroke:1px_theme(--color-primary-foreground)]">
            Solutions
          </span> {" "}
          Built for Growing Businesses
        </h2>

        <p className="w-full lg:w-3/4 xl:w-3/5">
          From small shops to fast-growing retailers, Kita adapts to how you work — giving you more control, 
          less manual work, and total clarity across your business.
        </p>

        <SolutionList/>
      </div>
    </Section>
  )
}