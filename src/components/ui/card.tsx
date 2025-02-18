// Save as: src/components/ui/card.tsx

import * as React from "react";
import { CardProps } from "@/types/components";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { cva } from "class-variance-authority";

const cardVariants = cva(
  "rounded-lg transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground shadow-sm",
        bordered: "border-2 border-border bg-card text-card-foreground",
        elevated: "bg-card text-card-foreground shadow-lg hover:shadow-xl"
      },
      size: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, isHoverable, isInteractive, children, ...props }, ref) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, size }),
          isHoverable && "hover:scale-[1.02] transition-transform",
          isInteractive && "cursor-pointer",
          isFocused && "ring-2 ring-primary",
          className
        )}
        tabIndex={isInteractive ? 0 : undefined}
        role={isInteractive ? "button" : "region"}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => {
          if (isInteractive && e.key === 'Enter') {
            props.onClick?.(e as any);
          }
        }}
        data-theme={theme}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, BaseProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

// ... Rest of the card components with similar enhancements
