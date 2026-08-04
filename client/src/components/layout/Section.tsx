import { cn } from "@/lib/utils"


type SectionProps = React.ComponentProps<"section">

export default function Section({ 
  children,
  className, 
  ...props
}: SectionProps) {
  return (
    <section {...props} className={cn(
      "pt-20 md:pt-32 w-full",
      className
    )}>
      {children}
    </section>
  );
}