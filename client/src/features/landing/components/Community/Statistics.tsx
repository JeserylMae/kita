

const wrapper = (`pt-4 w-full 2xl:w-8/10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-1`);
const highlightContainer = (`flex flex-col justify-center items-center`);
const highlighNumber = (`gradient-text-vr text-5xl md:text-[9rem]/40 font-medium font-heading`);
const bodyStyle = (`w-full xl:w-9/10`);

const statsItems = [
  {
    heading: "5,000",
    body: "Trusted by over 5,000 businesses across the country.",
  }, {
    heading: "1B",
    body: "Managing over 1 billion inventory transactions every year.",
  }, {
    heading: "30%",
    body: "Our clients see an average 30% reduction in stock loses.",
  }, {
    heading: "99%",
    body: "99% uptime, ensuring your inventory is always accurate.",
  }, 
]

export default function Statistics() {
  return (
    <div className={wrapper}>
      {statsItems.map(({heading, body}, index) => (
        <div key={index} className={highlightContainer}>
          <p className={highlighNumber}> {heading} </p>
          <p className={bodyStyle}>      {body} </p>
        </div>
      ))}
    </div>
  );
}