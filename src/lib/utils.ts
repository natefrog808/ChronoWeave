// Save as: src/lib/utils.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Color manipulation utilities
export const adjustColor = (color: string, amount: number) => {
  return `color-mix(in srgb, ${color}, ${amount > 0 ? 'white' : 'black'} ${Math.abs(amount)}%)`;
};

// Accessibility helpers
export const ensureContrast = (bgColor: string, textColor: string, minRatio = 4.5) => {
  // Implementation for contrast checking and adjustment
  return { background: bgColor, text: textColor };
};

// Animation utilities
export const createTransition = (
  properties: string[],
  duration = 200,
  easing = 'ease-in-out'
) => {
  return properties
    .map(prop => `${prop} ${duration}ms ${easing}`)
    .join(', ');
};

// Keyboard navigation
export const handleKeyboardNavigation = (
  event: KeyboardEvent,
  handlers: Record<string, () => void>
) => {
  const handler = handlers[event.key];
  if (handler) {
    event.preventDefault();
    handler();
  }
};
