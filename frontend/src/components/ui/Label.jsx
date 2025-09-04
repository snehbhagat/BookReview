import { cn } from "../../lib/cn";

export default function Label({ className, ...props }) {
  return (
    <label
      className={cn("mb-1 block text-sm font-medium text-muted-foreground", className)}
      {...props}
    />
  );
}