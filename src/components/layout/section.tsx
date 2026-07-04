import { cn } from "@/lib/utils";
import { Container } from "@/components/layout/container";

type SectionProps = React.ComponentProps<"section"> & {
  id: string;
  "aria-labelledby"?: string;
  compact?: boolean;
  containerClassName?: string;
};

export function Section({
  id,
  className,
  containerClassName,
  compact = false,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        compact ? "py-section-y-sm" : "py-section-y",
        className
      )}
      {...props}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
