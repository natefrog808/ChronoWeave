// Save as: src/components/ui/card.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { cva, type VariantProps } from 'class-variance-authority';
import { CardProps, BaseProps } from '@/types/components';

const cardVariants = cva(
  'rounded-lg transition-all duration-300 overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground shadow-sm',
        bordered: 'border-2 border-border bg-card text-card-foreground',
        elevated: 'bg-card text-card-foreground shadow-lg hover:shadow-xl',
        temporal:
          'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-card-foreground shadow-md border border-gray-300 dark:border-gray-700',
      },
      size: {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
      glow: {
        none: '',
        subtle: 'hover:ring-2 hover:ring-primary/50',
        intense: 'hover:ring-4 hover:ring-primary/70 animate-temporal-glow',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      glow: 'none',
    },
  }
);

interface EnhancedCardProps extends CardProps, VariantProps<typeof cardVariants> {
  isHoverable?: boolean;
  isInteractive?: boolean;
  glow?: 'none' | 'subtle' | 'intense';
  ripple?: boolean; // Toggle ripple effect on click
}

const Card = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  (
    {
      className,
      variant,
      size,
      glow,
      isHoverable,
      isInteractive,
      ripple = false,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = React.useState(false);
    const [rippleEffect, setRippleEffect] = React.useState<{ x: number; y: number } | null>(null);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (ripple && isInteractive) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setRippleEffect({ x, y });
        setTimeout(() => setRippleEffect(null), 600); // Ripple duration
      }
      onClick?.(e);
    };

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, size, glow }),
          isHoverable && 'hover:scale-[1.02] transition-transform',
          isInteractive && 'cursor-pointer',
          isFocused && 'ring-2 ring-primary',
          className
        )}
        tabIndex={isInteractive ? 0 : undefined}
        role={isInteractive ? 'button' : 'region'}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (isInteractive && e.key === 'Enter') {
            onClick?.(e as any);
          }
        }}
        data-theme={theme}
        aria-label={props['aria-label'] || (variant === 'temporal' ? 'Temporal Card' : 'Card')}
        {...props}
      >
        {rippleEffect && (
          <span
            className="absolute bg-primary/30 rounded-full animate-ripple"
            style={{
              left: rippleEffect.x - 25,
              top: rippleEffect.y - 25,
              width: 50,
              height: 50,
            }}
          />
        )}
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, BaseProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 border-b border-gray-200 dark:border-gray-700 pb-2', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, BaseProps>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold text-gray-900 dark:text-white', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, BaseProps>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-600 dark:text-gray-300', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, BaseProps>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('py-4', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, BaseProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center border-t border-gray-200 dark:border-gray-700 pt-2', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };

// Add to globals.css
const additionalStyles = `
  @keyframes temporal-glow {
    0% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
    50% { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5); }
    100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.3); }
  }
  .animate-temporal-glow {
    animation: temporal-glow 2s infinite ease-in-out;
  }
  @keyframes ripple {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(4); opacity: 0; }
  }
  .animate-ripple {
    animation: ripple 0.6s ease-out;
  }
`;
