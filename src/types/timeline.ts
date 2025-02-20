// Save as: src/types/timeline.ts

// Core Historical Event Interface with Enhanced Metadata
export interface HistoricalEvent {
  id: number;
  year: number; // Year of occurrence (negative for BCE)
  event: string; // Event title
  description: string; // Detailed description
  impact: Record<string, number>; // Key-value pairs of impact metrics
  effects?: number[]; // IDs of events this event influences
  causedBy?: number[]; // IDs of events that caused this event
  category: string; // Category ID linking to Category
  strength?: number; // Influence strength (0-1, default: 0.5)
  duration?: number; // Duration of impact in years (default: 10)
  tags?: string[]; // Keywords for filtering or analysis
  branchId?: string; // Optional branch identifier (e.g., "main", "branch-123")
  isParadox?: boolean; // Flag for paradoxical events (default: false)
  metadata?: Record<string, string | number | boolean>; // Arbitrary additional data
}

// Category Interface for Event Classification
export interface Category {
  id: string; // Unique identifier (e.g., "technological")
  label: string; // Human-readable name (e.g., "Technological")
  color: string; // Tailwind CSS class (e.g., "bg-blue-500")
  description?: string; // Optional category description
}

// Impact Type Interface for Effect Metrics
export interface ImpactType {
  id: string; // Unique identifier (e.g., "economy")
  label: string; // Human-readable name (e.g., "Economic Impact")
  color: string; // Tailwind CSS class (e.g., "bg-emerald-500")
  minValue?: number; // Minimum allowed value (default: 0)
  maxValue?: number; // Maximum allowed value (default: 200)
  unit?: string; // Display unit (default: "%")
}

// Enhanced Timeline Connection Interface
export interface TimelineConnection {
  from: number; // Starting year or event ID
  to: number; // Ending year or event ID
  type: 'effect' | 'dependency' | 'paradox' | 'indirect'; // Connection type
  strength?: number; // Connection strength (0-1, default: 0.5)
  duration?: number; // Duration of influence in years
  direction?: 'forward' | 'backward' | 'bidirectional'; // Temporal direction
  label?: string; // Optional descriptive label
}

// Flexible Timeline Effects Interface
export interface TimelineEffects {
  economy: number;
  society: number;
  technology: number;
  education: number;
  health: number;
  environment?: number; // Optional additional metric
  culture?: number;    // Optional additional metric
  political?: number;  // Optional additional metric
  [key: string]: number | undefined; // Allow custom metrics
}

// Timeline Branch Interface
export interface TimelineBranch {
  id: string; // Unique branch identifier (e.g., "main", "branch-123")
  events: HistoricalEvent[]; // Events in this branch
  parentBranch?: string; // ID of the parent branch (if forked)
  createdAt: number; // Timestamp of branch creation (Unix ms)
  name?: string; // Optional human-readable name
}

// Validation Constraint Interface
export interface ValidationConstraints {
  allowNegativeYears?: boolean; // Allow BCE years (default: true)
  maxImpactValue?: number; // Max impact value (default: 200)
  minImpactValue?: number; // Min impact value (default: 0)
  maxEvents?: number; // Max number of events (default: Infinity)
  uniqueIds?: boolean; // Enforce unique event IDs (default: true)
}

// Utility Type: Partial Event for Updates
export type PartialHistoricalEvent = Partial<HistoricalEvent> & { id: number };
