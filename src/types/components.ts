// Save as: src/types/components.ts
import { HTMLAttributes, MouseEvent, KeyboardEvent, ReactNode } from 'react';

// Base interface for all components
export interface BaseProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  className?: string;
}

// Enhanced Card Props (aligned with upgraded Card.tsx)
export interface CardProps extends BaseProps {
  variant?: 'default' | 'bordered' | 'elevated' | 'temporal';
  size?: 'sm' | 'md' | 'lg';
  isHoverable?: boolean;
  isInteractive?: boolean;
  glow?: 'none' | 'subtle' | 'intense';
  ripple?: boolean;
  onClick?: (e: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
}

// Comprehensive Timeline Props (for AdvancedTimeline)
export interface TimelineProps extends BaseProps {
  showConnections?: boolean; // Toggle connection visibility
  enableZoom?: boolean;      // Enable pinch/scroll zooming
  allowFiltering?: boolean;  // Enable category/impact filters
  interactive?: boolean;     // Allow clicking/hovering events
  initialYear?: number;      // Starting year (default: 1800)
  yearRange?: number;        // Range of years (default: 50)
  pixelsPerYear?: number;    // Scaling factor (default: 4)
  events?: HistoricalEvent[]; // Optional event override
  branches?: Map<string, HistoricalEvent[]>; // Timeline branches
  onBranchChange?: (branchId: string) => void; // Callback for branch switch
  onYearChange?: (year: number) => void;      // Callback for year jump
}

// Effects Panel Props (aligned with EffectsPanel.tsx)
export interface EffectsPanelProps extends BaseProps {
  effects: TimelineEffects;
  year: number;
  onMetricSelect?: (metric: string) => void; // Callback for metric drill-down
}

// Timeline Connections Props (aligned with TimelineConnections.tsx)
export interface TimelineConnectionsProps extends BaseProps {
  connections: TimelineConnection[];
  containerWidth: number;
  containerHeight?: number;
  baseYear?: number;
}

// Timeline Legend Props (aligned with TimelineLegend.tsx)
export interface TimelineLegendProps extends BaseProps {
  filteredEvents: HistoricalEvent[];
  categories: Category[];
  impactTypes: ImpactType[];
  onCategoryToggle?: (categoryId: string) => void;
  onImpactToggle?: (impactId: string) => void;
}

// Extended Theme Types (aligned with useTheme.ts)
export type Theme = 'light' | 'dark' | 'system' | 'past' | 'future' | 'paradox';

// Utility Types
export type Size = 'sm' | 'md' | 'lg';
export type Variant = 'default' | 'bordered' | 'elevated' | 'temporal';
export type Glow = 'none' | 'subtle' | 'intense';

// Re-export timeline types for convenience (assuming they're in timeline.ts)
export { HistoricalEvent, Category, ImpactType, TimelineConnection, TimelineEffects } from '@/types/timeline';
