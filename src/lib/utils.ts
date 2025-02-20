// Save as: src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { HistoricalEvent, TimelineConnection } from '@/types/timeline';

// Core class name utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Temporal calculation utilities
/**
 * Calculate exponential decay for an effect over time
 * @param initialValue Starting value of the effect
 * @param timeDelta Years between events
 * @param halfLife Decay half-life in years (default: 20)
 * @returns Decayed value
 */
export const calculateDecay = (initialValue: number, timeDelta: number, halfLife: number = 20): number => {
  return initialValue * Math.exp((-Math.LN2 * timeDelta) / halfLife);
};

/**
 * Scale a year to a pixel position on the timeline
 * @param year Year to scale
 * @param baseYear Starting year of timeline
 * @param pixelsPerYear Pixels per year (default: 4)
 * @returns Pixel position
 */
export const scaleYearToPixels = (year: number, baseYear: number, pixelsPerYear: number = 4): number => {
  return (year - baseYear) * pixelsPerYear;
};

// Formatting utilities
/**
 * Format a year with era suffix
 * @param year Year to format
 * @returns Formatted string (e.g., "1800 CE")
 */
export const formatYear = (year: number): string => {
  return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
};

/**
 * Format an impact value with sign and percentage
 * @param value Impact value
 * @returns Formatted string (e.g., "+30%" or "-15%")
 */
export const formatImpact = (value: number): string => {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
};

/**
 * Convert an object of impacts to a readable string
 * @param impact Impact object
 * @returns Formatted string (e.g., "Economy: +30%, Society: -20%")
 */
export const formatImpactObject = (impact: Record<string, number>): string => {
  return Object.entries(impact)
    .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${formatImpact(value)}`)
    .join(', ');
};

// Validation utilities
/**
 * Validate an array of historical events for consistency
 * @param events Array of events
 * @returns Array of error messages (empty if valid)
 */
export const validateEvents = (events: HistoricalEvent[]): string[] => {
  const errors: string[] = [];
  const eventIds = new Set<number>();

  events.forEach((event) => {
    if (eventIds.has(event.id)) {
      errors.push(`Duplicate event ID: ${event.id}`);
    }
    eventIds.add(event.id);

    const checkRefs = (ids: number[] | undefined, type: string) => {
      ids?.forEach((id) => {
        if (!events.some((e) => e.id === id)) {
          errors.push(`${type} references unknown event ID ${id} in event ${event.id}`);
        }
      });
    };
    checkRefs(event.effects, 'Effects');
    checkRefs(event.causedBy, 'CausedBy');
  });

  return errors;
};

/**
 * Check for paradoxes in timeline connections
 * @param events Array of events
 * @returns Array of paradox descriptions
 */
export const detectParadoxes = (events: HistoricalEvent[]): string[] => {
  const paradoxes: string[] = [];
  const visited = new Set<number>();
  const path = new Set<number>();

  const dfs = (eventId: number) => {
    if (path.has(eventId)) {
      paradoxes.push(`Circular dependency detected at event ${eventId}`);
      return;
    }
    if (visited.has(eventId)) return;
    visited.add(eventId);
    path.add(eventId);

    const event = events.find((e) => e.id === eventId);
    if (event?.effects) {
      event.effects.forEach(dfs);
    }
    path.delete(eventId);
  };

  events.forEach((e) => dfs(e.id));
  return paradoxes;
};

// UI enhancer utilities
/**
 * Generate a random color from Tailwind palette
 * @returns Tailwind background color class (e.g., "bg-blue-500")
 */
export const getRandomTailwindColor = (): string => {
  const colors = [
    'blue', 'green', 'purple', 'amber', 'teal', 'pink', 'red', 'indigo', 'cyan', 'orange',
  ];
  const shades = [400, 500, 600];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const shade = shades[Math.floor(Math.random() * shades.length)];
  return `bg-${color}-${shade}`;
};

/**
 * Generate a unique ID for branches or events
 * @param prefix Optional prefix (e.g., "branch")
 * @returns Unique ID (e.g., "branch-16987654321")
 */
export const generateUniqueId = (prefix: string = ''): string => {
  return `${prefix}${prefix ? '-' : ''}${Date.now()}${Math.floor(Math.random() * 1000)}`;
};

/**
 * Clamp a value between a min and max
 * @param value Value to clamp
 * @param min Minimum value
 * @param max Maximum value
 * @returns Clamped value
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

// Type utilities
/**
 * Pick a random item from an array
 * @param array Array to pick from
 * @returns Random item or undefined if empty
 */
export const pickRandom = <T>(array: T[]): T | undefined => {
  return array[Math.floor(Math.random() * array.length)];
};
