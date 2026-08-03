import {
  Gauge,
  ChartLine,
  ShelvingUnit,
  ChartCandlestick,
  ChartNoAxesCombined,
  CircleDollarSign,
  CloudCheck,
  Target,
  Factory,
  BadgeCheck,
} from "lucide-react";


const carouselItemStyle = (`
  flex shrink-0 flex-row gap-1.5 
  rounded-4xl p-2 pr-3
  text-2xl font-medium font-heading
  text-primary-foreground
  items-center justify-center
`);

const carouselItems = [
  { icon: Gauge, text: "Real-Time Insights" },
  { icon: ChartLine, text: "Data-Driven Decisions" },
  { icon: ShelvingUnit, text: "Clear Inventory Visibility" },
  { icon: ChartCandlestick, text: "Seamless Stock Control" },
  { icon: ChartNoAxesCombined, text: "Automated Analytics" },
  { icon: CircleDollarSign, text: "Profit Optimization" },
  { icon: CloudCheck, text: "Cloud Accessibility" },
  { icon: Target, text: "Inventory Precision" },
  { icon: Factory, text: "Business Clarity" },
  { icon: BadgeCheck, text: "Decision Confidence" },
];

export default function FeatureCarousel() {
  return (
    <>
      {carouselItems.map(({ icon: Icon, text }, index) => (
        <div key={text}
          className={`${carouselItemStyle} ${
            index % 2 === 0 ? "bg-primary" : "bg-tertiary"
          }`}
        >
          <Icon /> <p>{text}</p>
        </div>
      ))}
    </>
  );
}
