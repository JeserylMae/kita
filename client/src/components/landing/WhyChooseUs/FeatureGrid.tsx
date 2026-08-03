import { features } from "process";

const row1 = "col-span-2";

const gridItems = [
  {
    heading: "Safe & Compliant",
    body: "Your inventory is encrypted, backed up, and protected against unauthorized access.",
    className: row1,
  }, {
    heading: "Connect Effortlessly",
    body: "Work smoothly with youor POS, accounting software, or e-commerce platforms.",
    className: row1,
  }, {
    heading: "Data-Driven Decisions",
    body: "Receive automated suggestions for restocking, promotions, or discounts.",
    className: row1,
  }, {
    heading: "Grow Without Limits",
    body: "Whether you have 1 store or 50, Kita adapts to your business needs.",
    className: "md:col-span-2 md:col-start-2",
  }, {
    heading: "Simple & Intuitive",
    body: "Easy to navigate dashboards, even for non-technical users.",
    className: "col-span-2",
  }, 
];

export default function FeatureGrid() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-x-6 gap-y-10 xl:w-2/3">
        {gridItems.map((features) => (
          <div key={features.heading} className={features.className}>
            <h3 className="text-center text-2xl text-tertiary font-semibold">
              {features.heading}
            </h3>
            <p className="text-center mt-2">{features.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}