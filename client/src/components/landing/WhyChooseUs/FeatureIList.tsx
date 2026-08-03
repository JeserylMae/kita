import Image from "next/image";


const featureCard = (`
  group
  relative w-full h-max p-4 xl:py-6 xl:px-8
  flex flex-col justify-center items-start
  border-b first:border-y border-border
  hover:bg-primary-gradient-hr
  transition-colors duration-300
`);

const featureItemStyle = (`
  absolute top-1/2 -translate-y-1/2 right-0 
  -translate-x-10 lg:-translate-x-5 xl:-translate-x-10
  opacity-0  sm:group-hover:opacity-100
  transition-opacity duration-300
`);

const featureImageStyle = (`
  relative w-30 h-30 xl:w-40 xl:h-40
  border-tertiary border-6 
`);

const featureItems = [
  { 
    heading: "Track everything in real time", 
    body: "No more guesswork or manual spreadsheets.", 
    image: "/landing/wcu-feature-highlight-1.jpg", 
    imageAlt: "Managing inventory anywhere using any device."
  }, { 
    heading: "Spot trends instantly", 
    body: "Identify bestsellers and low-movers with visual analytics.", 
    image: "/landing/wcu-feature-highlight-2.png", 
    imageAlt: "Tracking trends with charts.",
  }, { 
    heading: "Reduce waste boost profit", 
    body: "Plan ahead and avoid overstock or expired products.", 
    image: "/landing/wcu-feature-highlight-3.png", 
    imageAlt: "Discarding products from shelves.",
  }, { 
    heading: "Access anywhere", 
    body: "Your data, always secure and available on any device.", 
    image: "/landing/wcu-feature-highlight-4.png", 
    imageAlt: "Inventory on the cloud.",
  },
];

export default function FeatureList() {
  return (
    <>
      {featureItems.map(({ heading, body, image, imageAlt }, index) => (
        <div className={featureCard} key={index}>
          <h3 className="text-xl xl:text-2xl font-semibold capitalize"> {heading} </h3>
          <p> {body} </p>

          <div className={featureItemStyle}>
            <div className={featureImageStyle}>
                <Image src={image} fill sizes="100%" alt={imageAlt} className="object-cover" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

